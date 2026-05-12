import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type AppRole = "customer" | "business_owner" | "sponsor" | "admin";

interface AdminUsersRequest {
  action?: "list" | "create" | "update" | "delete" | "addRole" | "removeRole";
  userId?: string;
  email?: string;
  password?: string;
  full_name?: string;
  phone?: string | null;
  role?: AppRole;
}

const allowedRoles = new Set<AppRole>(["customer", "business_owner", "sponsor", "admin"]);
const cleanupTables = [
  "user_roles",
  "profiles",
  "notifications",
  "push_notification_tokens",
  "loyalty_history",
  "loyalty_points",
  "promotion_redemptions",
  "proximity_notifications_sent",
  "route_visits",
  "user_favorites",
];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const normalizePhone = (phone?: string | null) => {
  const value = phone?.trim();
  return value ? value : null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const authHeader = req.headers.get("Authorization") ?? "";

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      return json({ error: "Configuración del backend incompleta" }, 500);
    }

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const {
      data: { user: requester },
      error: requesterError,
    } = await authClient.auth.getUser();

    if (requesterError || !requester) {
      return json({ error: "Usuario no autenticado" }, 401);
    }

    const { data: adminRole, error: adminRoleError } = await adminClient
      .from("user_roles")
      .select("id")
      .eq("user_id", requester.id)
      .eq("role", "admin")
      .maybeSingle();

    if (adminRoleError) {
      console.error("Error validating admin role", adminRoleError);
      return json({ error: "No se pudo validar el acceso" }, 500);
    }

    if (!adminRole) {
      return json({ error: "No tienes permisos de administrador" }, 403);
    }

    const body = req.method === "POST" ? ((await req.json().catch(() => ({}))) as AdminUsersRequest) : {};
    const action = body.action ?? "list";

    const ensureSponsorProfile = async (userId: string, fullName?: string, email?: string) => {
      const { data: existingSponsor, error: sponsorLookupError } = await adminClient
        .from("sponsors")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (sponsorLookupError) {
        throw sponsorLookupError;
      }

      if (!existingSponsor) {
        const { error: sponsorInsertError } = await adminClient.from("sponsors").insert({
          user_id: userId,
          brand_name: fullName?.trim() || email || "Patrocinador",
          contact_person: fullName?.trim() || null,
          email: email || null,
          status: "aprobado",
        });

        if (sponsorInsertError) {
          throw sponsorInsertError;
        }
      }
    };

    const countAdmins = async () => {
      const { count, error } = await adminClient
        .from("user_roles")
        .select("id", { count: "exact", head: true })
        .eq("role", "admin");

      if (error) {
        throw error;
      }

      return count ?? 0;
    };

    switch (action) {
      case "list": {
        const allUsers: any[] = [];
        let page = 1;

        while (true) {
          const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 1000 });
          if (error) {
            throw error;
          }

          const batch = data.users ?? [];
          allUsers.push(...batch);

          if (batch.length < 1000) break;
          page += 1;
        }

        const ids = allUsers.map((item) => item.id);

        if (ids.length === 0) {
          return json({ users: [] });
        }

        const [{ data: profiles, error: profilesError }, { data: roles, error: rolesError }] = await Promise.all([
          adminClient.from("profiles").select("id, full_name, phone, created_at").in("id", ids),
          adminClient.from("user_roles").select("user_id, role").in("user_id", ids),
        ]);

        if (profilesError) throw profilesError;
        if (rolesError) throw rolesError;

        const profilesMap = new Map((profiles ?? []).map((profile: any) => [profile.id, profile]));
        const rolesMap = new Map<string, AppRole[]>();

        for (const roleRow of roles ?? []) {
          const currentRoles = rolesMap.get(roleRow.user_id) ?? [];
          currentRoles.push(roleRow.role as AppRole);
          rolesMap.set(roleRow.user_id, currentRoles);
        }

        const users = allUsers
          .map((authUser) => {
            const profile = profilesMap.get(authUser.id);
            const userRoles = rolesMap.get(authUser.id) ?? [];

            return {
              id: authUser.id,
              email: authUser.email ?? null,
              full_name: profile?.full_name ?? authUser.user_metadata?.full_name ?? null,
              phone: profile?.phone ?? null,
              created_at: profile?.created_at ?? authUser.created_at,
              last_sign_in_at: authUser.last_sign_in_at ?? null,
              email_confirmed_at: authUser.email_confirmed_at ?? null,
              roles: userRoles,
            };
          })
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return json({ users });
      }

      case "create": {
        const email = body.email?.trim().toLowerCase();
        const password = body.password?.trim();
        const role = body.role;
        const fullName = body.full_name?.trim() || "";
        const phone = normalizePhone(body.phone);

        if (!email || !password || !role || !allowedRoles.has(role)) {
          return json({ error: "Debes enviar email, contraseña y rol válidos" }, 400);
        }

        if (password.length < 6) {
          return json({ error: "La contraseña debe tener al menos 6 caracteres" }, 400);
        }

        const createPayload: Record<string, unknown> = {
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            role: role === "admin" ? "customer" : role,
          },
        };

        const { data: createdUserData, error: createUserError } = await adminClient.auth.admin.createUser(createPayload);
        if (createUserError || !createdUserData.user) {
          throw createUserError ?? new Error("No se pudo crear el usuario");
        }

        const newUser = createdUserData.user;

        const { error: profileError } = await adminClient.from("profiles").upsert({
          id: newUser.id,
          full_name: fullName || null,
          phone,
        });

        if (profileError) throw profileError;

        if (role === "admin") {
          await adminClient.from("user_roles").delete().eq("user_id", newUser.id).eq("role", "customer");
          const { error: adminInsertError } = await adminClient.from("user_roles").insert({ user_id: newUser.id, role: "admin" });
          if (adminInsertError) throw adminInsertError;
        }

        if (role === "sponsor") {
          await ensureSponsorProfile(newUser.id, fullName, email);
        }

        return json({
          user: {
            id: newUser.id,
            email,
            full_name: fullName || null,
            phone,
            created_at: newUser.created_at,
            roles: role === "admin" ? ["admin"] : [role],
          },
        });
      }

      case "update": {
        const userId = body.userId;
        const email = body.email?.trim().toLowerCase();
        const password = body.password?.trim();
        const fullName = body.full_name?.trim() || null;
        const phone = normalizePhone(body.phone);

        if (!userId || !email) {
          return json({ error: "Debes indicar el usuario y el email" }, 400);
        }

        const updatePayload: Record<string, unknown> = {
          email,
          email_confirm: true,
          user_metadata: { full_name: fullName ?? "" },
        };

        if (password) {
          if (password.length < 6) {
            return json({ error: "La contraseña debe tener al menos 6 caracteres" }, 400);
          }
          updatePayload.password = password;
        }

        const { data: updatedUserData, error: updateUserError } = await adminClient.auth.admin.updateUserById(userId, updatePayload);
        if (updateUserError || !updatedUserData.user) {
          throw updateUserError ?? new Error("No se pudo actualizar el usuario");
        }

        const { error: profileError } = await adminClient.from("profiles").upsert({
          id: userId,
          full_name: fullName,
          phone,
        });
        if (profileError) throw profileError;

        const { data: sponsorProfile } = await adminClient.from("sponsors").select("id").eq("user_id", userId).maybeSingle();
        if (sponsorProfile) {
          await adminClient.from("sponsors").update({
            contact_person: fullName,
            email,
          }).eq("user_id", userId);
        }

        return json({ success: true });
      }

      case "addRole": {
        const userId = body.userId;
        const role = body.role;

        if (!userId || !role || !allowedRoles.has(role)) {
          return json({ error: "Debes indicar un usuario y rol válidos" }, 400);
        }

        const { data: profile } = await adminClient.from("profiles").select("full_name").eq("id", userId).maybeSingle();
        const { data: authUserData, error: authUserError } = await adminClient.auth.admin.getUserById(userId);
        if (authUserError || !authUserData.user) {
          throw authUserError ?? new Error("Usuario no encontrado");
        }

        const { error: roleInsertError } = await adminClient
          .from("user_roles")
          .insert({ user_id: userId, role });

        if (roleInsertError) {
          if ((roleInsertError as any).code === "23505") {
            return json({ error: "Ese usuario ya tiene ese rol" }, 409);
          }
          throw roleInsertError;
        }

        if (role === "sponsor") {
          await ensureSponsorProfile(userId, profile?.full_name ?? undefined, authUserData.user.email ?? undefined);
        }

        return json({ success: true });
      }

      case "removeRole": {
        const userId = body.userId;
        const role = body.role;

        if (!userId || !role || !allowedRoles.has(role)) {
          return json({ error: "Debes indicar un usuario y rol válidos" }, 400);
        }

        if (userId === requester.id && role === "admin") {
          return json({ error: "No puedes quitarte tu propio rol de administrador" }, 400);
        }

        if (role === "admin") {
          const adminCount = await countAdmins();
          if (adminCount <= 1) {
            return json({ error: "Debe existir al menos un administrador activo" }, 400);
          }
        }

        const { data: existingRoles, error: existingRolesError } = await adminClient
          .from("user_roles")
          .select("id")
          .eq("user_id", userId);

        if (existingRolesError) throw existingRolesError;
        if (!existingRoles || existingRoles.length <= 1) {
          return json({ error: "El usuario debe conservar al menos un rol" }, 400);
        }

        const { error: roleDeleteError } = await adminClient
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", role);

        if (roleDeleteError) throw roleDeleteError;
        return json({ success: true });
      }

      case "delete": {
        const userId = body.userId;
        if (!userId) {
          return json({ error: "Debes indicar el usuario a eliminar" }, 400);
        }

        if (userId === requester.id) {
          return json({ error: "No puedes eliminar tu propia cuenta" }, 400);
        }

        const [{ data: roles, error: rolesError }, { count: ownedBusinesses, error: businessesError }] = await Promise.all([
          adminClient.from("user_roles").select("role").eq("user_id", userId),
          adminClient.from("businesses").select("id", { count: "exact", head: true }).eq("owner_id", userId),
        ]);

        if (rolesError) throw rolesError;
        if (businessesError) throw businessesError;

        if ((ownedBusinesses ?? 0) > 0) {
          return json({ error: "No puedes eliminar un usuario que todavía es propietario de negocios" }, 400);
        }

        const isAdminTarget = (roles ?? []).some((item: any) => item.role === "admin");
        if (isAdminTarget) {
          const adminCount = await countAdmins();
          if (adminCount <= 1) {
            return json({ error: "Debe existir al menos un administrador activo" }, 400);
          }
        }

        const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(userId);
        if (authDeleteError) throw authDeleteError;

        await Promise.all([
          ...cleanupTables.map((table) => adminClient.from(table).delete().eq(table === "profiles" ? "id" : "user_id", userId)),
          adminClient.from("sponsors").delete().eq("user_id", userId),
        ]);

        return json({ success: true });
      }

      default:
        return json({ error: "Acción no soportada" }, 400);
    }
  } catch (error) {
    console.error("admin-users function error", error);
    const message = error instanceof Error ? error.message : "Error inesperado";
    return json({ error: message }, 500);
  }
});
