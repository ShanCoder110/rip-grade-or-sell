import "server-only";
import { createClient } from "@/lib/supabase/server";
import { hasPublicSupabaseConfig } from "@/env";

export type UserPlan = "free" | "pro";

export async function getUserPlan(): Promise<UserPlan> {
  if (!hasPublicSupabaseConfig()) return "free";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return "free";
    const { data } = await supabase
      .from("entitlements")
      .select("plan, status")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data?.plan === "pro" && data.status === "active") return "pro";
    return "free";
  } catch {
    return "free";
  }
}

export async function requirePro(): Promise<{ ok: true } | { ok: false; reason: string }> {
  const plan = await getUserPlan();
  if (plan !== "pro") return { ok: false, reason: "Pro subscription required" };
  return { ok: true };
}

export const FREE_HISTORY_DAYS = 30;

export function filterHistoryByPlan<T extends { captured_on: string }>(
  rows: T[],
  plan: UserPlan,
): T[] {
  if (plan === "pro") return rows;
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - FREE_HISTORY_DAYS);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  return rows.filter((r) => r.captured_on >= cutoffStr);
}
