/** Local demo auth. Safe to import from middleware (no server-only). */

import { isPublicSupabaseConfigured } from "@/lib/supabase/config";

export const DEMO_ID_COOKIE = "rgs_demo_id";
export const DEMO_EMAIL_COOKIE = "rgs_demo_email";

export function hasPublicSupabaseEnv(): boolean {
  return isPublicSupabaseConfigured(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function isDemoAuthFlagEnabled(): boolean {
  const flag = process.env.RGS_DEMO_AUTH?.trim().toLowerCase();
  return flag === "1" || flag === "true" || flag === "yes";
}

/** Cookie sign-in used when Supabase is not configured (local dev / CI with RGS_DEMO_AUTH). */
export function isDemoAuthEnabled(): boolean {
  if (hasPublicSupabaseEnv()) return false;
  if (isDemoAuthFlagEnabled()) return true;
  return process.env.NODE_ENV !== "production";
}
