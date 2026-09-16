import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SELLERS = [
  { email: "robinsonsandoval@gmail.com", password: "Robin321$%", full_name: "Robinson Sandoval" },
  { email: "leidyrosero88@gmail.com", password: "Leidy2026$%", full_name: "Leidy Rosero" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const results: unknown[] = [];

  for (const seller of SELLERS) {
    let userId: string | null = null;

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: seller.email,
      password: seller.password,
      email_confirm: true,
      user_metadata: { full_name: seller.full_name, role: "seller" },
    });

    if (created?.user) {
      userId = created.user.id;
    } else {
      const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const found = list?.users.find((u) => u.email?.toLowerCase() === seller.email);
      userId = found?.id ?? null;
      if (userId) {
        await admin.auth.admin.updateUserById(userId, {
          password: seller.password,
          email_confirm: true,
        });
      }
    }

    if (!userId) {
      results.push({ email: seller.email, error: createError?.message ?? "no user" });
      continue;
    }

    await admin.from("profiles").upsert({ id: userId, full_name: seller.full_name }, { onConflict: "id" });
    await admin.from("user_roles").upsert(
      { user_id: userId, role: "seller" },
      { onConflict: "user_id,role", ignoreDuplicates: true },
    );
    await admin.from("sellers").upsert(
      {
        user_id: userId,
        full_name: seller.full_name,
        email: seller.email,
        commission_percentage: 25,
        active: true,
      },
      { onConflict: "user_id" },
    );

    results.push({ email: seller.email, user_id: userId, ok: true });
  }

  return new Response(JSON.stringify({ results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
