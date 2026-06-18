import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const OTHER_URL = "https://xxlspwyzjnxqaflwycfd.supabase.co";
const OTHER_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4bHNwd3l6am54cWFmbHd5Y2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDAxMzcsImV4cCI6MjA5MDQ3NjEzN30.SmIBHObOfXqetU16qTK6QXDOZ8gTptaP6_lMnHOUoHE";
const OWNER = "00000000-0000-0000-0000-000000000001";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const fetchAll = async (table: string) => {
      const r = await fetch(`${OTHER_URL}/rest/v1/${table}?select=*`, {
        headers: { apikey: OTHER_KEY, Authorization: `Bearer ${OTHER_KEY}` },
      });
      if (!r.ok) throw new Error(`${table}: ${r.status} ${await r.text()}`);
      return r.json();
    };

    const businesses = await fetchAll("businesses");
    const shorts = await fetchAll("business_shorts");
    const images = await fetchAll("business_images");
    const menu = await fetchAll("business_menu");
    const hours = await fetchAll("business_hours");
    const branches = await fetchAll("business_branches");
    const attributes = await fetchAll("business_attributes");

    for (const b of businesses) b.owner_id = OWNER;

    const { error: be } = await admin
      .from("businesses")
      .upsert(businesses, { onConflict: "id" });
    if (be) throw be;

    const bizIds = new Set(businesses.map((b: any) => b.id));
    const filteredShorts = shorts.filter((s: any) => bizIds.has(s.business_id));
    const { error: se } = await admin
      .from("business_shorts")
      .upsert(filteredShorts, { onConflict: "id" });
    if (se) throw se;

    const seedChild = async (
      table: string,
      rows: any[],
    ): Promise<number> => {
      const filtered = rows.filter((r: any) => bizIds.has(r.business_id));
      if (filtered.length === 0) return 0;
      const { error } = await admin
        .from(table)
        .upsert(filtered, { onConflict: "id" });
      if (error) throw new Error(`${table}: ${error.message}`);
      return filtered.length;
    };

    const imagesCount = await seedChild("business_images", images);
    const menuCount = await seedChild("business_menu", menu);
    const hoursCount = await seedChild("business_hours", hours);
    const branchesCount = await seedChild("business_branches", branches);
    const attributesCount = await seedChild("business_attributes", attributes);

    return new Response(
      JSON.stringify({
        ok: true,
        businesses: businesses.length,
        shorts: filteredShorts.length,
        images: imagesCount,
        menu: menuCount,
        hours: hoursCount,
        branches: branchesCount,
        attributes: attributesCount,
      }),
      { headers: { ...cors, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: String(e?.message ?? e) }),
      {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      },
    );
  }
});