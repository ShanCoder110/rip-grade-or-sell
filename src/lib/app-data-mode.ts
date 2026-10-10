import "server-only";
import { hasPublicSupabaseConfig } from "@/env";
import { readDemoSession } from "@/lib/auth/demo-session";

export type AppDataMode = "supabase" | "demo" | "none";

export async function getAppDataMode(): Promise<AppDataMode> {
  if (hasPublicSupabaseConfig()) return "supabase";
  const demo = await readDemoSession();
  if (demo) return "demo";
  return "none";
}
