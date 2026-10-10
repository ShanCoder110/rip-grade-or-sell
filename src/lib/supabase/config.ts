/**
 * Shared Supabase env helpers (safe for client, middleware, and server).
 * Treats .env.example placeholders as "not configured".
 */

const PLACEHOLDER_LITERALS = new Set([
  "your-anon-key",
  "your-service-role-key",
  "your-service_role_key",
  "changeme",
  "change-me",
  "replace-me",
  "xxx",
]);

/** True when the value is missing or still an example/placeholder from .env.example. */
export function isPlaceholderEnvValue(value: string | undefined | null): boolean {
  if (value == null) return true;
  const trimmed = value.trim();
  if (trimmed === "") return true;
  const lower = trimmed.toLowerCase();
  if (PLACEHOLDER_LITERALS.has(lower)) return true;
  if (/^your[-_].*key$/i.test(trimmed)) return true;
  if (/^<.*>$/.test(trimmed)) return true;
  return false;
}

export function resolveSupabaseUrl(url: string | undefined): string | undefined {
  return isPlaceholderEnvValue(url) ? undefined : url!.trim();
}

export function resolveSupabaseAnonKey(key: string | undefined): string | undefined {
  return isPlaceholderEnvValue(key) ? undefined : key!.trim();
}

export function resolveSupabaseServiceRoleKey(key: string | undefined): string | undefined {
  return isPlaceholderEnvValue(key) ? undefined : key!.trim();
}

/** Public client config (URL + anon key) is usable for auth and browser Supabase. */
export function isPublicSupabaseConfigured(
  url: string | undefined,
  anonKey: string | undefined,
): boolean {
  return Boolean(resolveSupabaseUrl(url) && resolveSupabaseAnonKey(anonKey));
}

/** Full stack including service role (ingest, webhooks, server writes). */
export function isSupabaseConfigured(
  url: string | undefined,
  anonKey: string | undefined,
  serviceRoleKey: string | undefined,
): boolean {
  return (
    isPublicSupabaseConfigured(url, anonKey) &&
    Boolean(resolveSupabaseServiceRoleKey(serviceRoleKey))
  );
}
