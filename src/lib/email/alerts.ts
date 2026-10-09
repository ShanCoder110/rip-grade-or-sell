import "server-only";
import { env } from "@/env";
import { createServiceClient } from "@/lib/supabase/service";
import { hasSupabaseConfig } from "@/env";

export async function sendDailyAlertDigests(): Promise<{ sent: number; skipped: boolean }> {
  if (!hasSupabaseConfig() || !env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return { sent: 0, skipped: true };
  }

  const supabase = createServiceClient();
  const { data: alerts } = await supabase.from("alerts").select("*").eq("active", true).limit(100);
  if (!alerts?.length) return { sent: 0, skipped: false };

  // TODO: integrate Resend SDK and per-user unsubscribe tokens.
  // Placeholder: real implementation compares price_snapshots to threshold_cents per alert.
  return { sent: 0, skipped: false };
}
