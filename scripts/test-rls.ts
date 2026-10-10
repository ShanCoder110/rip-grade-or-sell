/**
 * RLS smoke tests — requires local Supabase (`supabase start`) and .env.local keys.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anon || !service) {
  console.error("Missing Supabase env vars. Copy .env.example to .env.local after supabase start.");
  process.exit(1);
}

const anonClient = createClient(url, anon);
const serviceClient = createClient(url, service);

async function main() {
  const { data: sets, error: setsErr } = await anonClient.from("sets").select("slug").limit(1);
  if (setsErr) throw new Error(`anon should read sets: ${setsErr.message}`);
  console.log("✓ anon can read public sets", sets?.[0]?.slug);

  const { error: ingestErr } = await anonClient.from("ingest_runs").select("id").limit(1);
  if (!ingestErr) {
    throw new Error("anon should not read ingest_runs");
  }
  console.log("✓ anon blocked from ingest_runs");

  const { error: watchWriteErr } = await anonClient.from("watchlist_items").insert({
    user_id: "00000000-0000-4000-8000-000000000000",
    card_id: "00000000-0000-4000-8000-000000000001",
  });
  if (!watchWriteErr) {
    throw new Error("anon should not insert watchlist_items");
  }
  console.log("✓ anon blocked from writing watchlist_items");

  const { data: svcSets } = await serviceClient.from("sets").select("count");
  if (!svcSets) throw new Error("service role should read sets");
  console.log("✓ service role can access data");

  console.log("RLS smoke tests passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
