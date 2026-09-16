import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TARGETS = [
  { email: "dorianeduardo@gmail.com", password: "Dorian880318$%" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const results: unknown[] = [];

  for (const target of TARGETS) {
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const found = list?.users.find((u) => u.email?.toLowerCase() === target.email);
    if (!found) {
      results.push({ email: target.email, error: "user not found" });
      continue;
    }
    const { error } = await admin.auth.admin.updateUserById(found.id, {
      password: target.password,
      email_confirm: true,
    });
    results.push({ email: target.email, ok: !error, error: error?.message ?? null });
  }

  return new Response(JSON.stringify({ results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
