/** Local demo auth/billing. Safe to import from middleware (no server-only). */

export const DEMO_ID_COOKIE = "rgs_demo_id";
export const DEMO_EMAIL_COOKIE = "rgs_demo_email";
export const DEMO_PLAN_COOKIE = "rgs_demo_plan";

export function hasStripeCheckoutConfig(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_PRICE_MONTHLY &&
      process.env.STRIPE_PRICE_YEARLY,
  );
}

export function hasPublicSupabaseEnv(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** Cookie sign-in used when Supabase is not configured (local dev / CI). */
export function isDemoAuthEnabled(): boolean {
  if (hasPublicSupabaseEnv()) return false;
  return process.env.NODE_ENV !== "production";
}

/**
 * Grants Pro without a card when Stripe price IDs are missing.
 * Off in production unless DEMO_CHECKOUT=true.
 */
export function isDemoBillingEnabled(): boolean {
  if (hasStripeCheckoutConfig()) return false;
  if (process.env.DEMO_CHECKOUT === "true") return true;
  if (process.env.DEMO_CHECKOUT === "false") return false;
  return process.env.NODE_ENV !== "production";
}
