/** Local demo auth. Safe to import from middleware (no server-only). */

export const DEMO_ID_COOKIE = "rgs_demo_id";
export const DEMO_EMAIL_COOKIE = "rgs_demo_email";

export function hasPublicSupabaseEnv(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** Cookie sign-in used when Supabase is not configured (local dev / CI). */
export function isDemoAuthEnabled(): boolean {
  if (hasPublicSupabaseEnv()) return false;
  return process.env.NODE_ENV !== "production";
}
