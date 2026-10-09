import "server-only";
import { createClient } from "@/lib/supabase/server";
import { hasPublicSupabaseConfig } from "@/env";
import { readDemoSession } from "@/lib/auth/demo-session";
import type { UserPlan } from "@/lib/auth/plan-limits";

export type { UserPlan } from "@/lib/auth/plan-limits";

export async function getUserPlan(): Promise<UserPlan> {
  const demo = await readDemoSession();
  if (demo?.plan === "pro") return "pro";
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
