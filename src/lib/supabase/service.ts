import { createClient } from "@supabase/supabase-js";
import { env, hasSupabaseConfig } from "@/env";

export function createServiceClient() {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase service role is not configured.");
  }
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
