import "server-only";
import { getUserPlan, requirePro } from "@/lib/auth/entitlements";
import { createClient } from "@/lib/supabase/server";
import { hasPublicSupabaseConfig } from "@/env";

export const FREE_WATCHLIST_CAP = 5;

export async function canAddWatchlistItem(): Promise<{ ok: boolean; reason?: string }> {
  const plan = await getUserPlan();
  if (plan === "pro") return { ok: true };
  if (!hasPublicSupabaseConfig()) return { ok: true };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "Sign in required" };
  const { count } = await supabase
    .from("watchlist_items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);
  if ((count ?? 0) >= FREE_WATCHLIST_CAP) {
    return { ok: false, reason: `Free plan limited to ${FREE_WATCHLIST_CAP} cards` };
  }
  return { ok: true };
}

export async function requireProFeature(feature: string) {
  const gate = await requirePro();
  if (!gate.ok) return { ok: false as const, reason: `${feature}: ${gate.reason}` };
  return { ok: true as const };
}
