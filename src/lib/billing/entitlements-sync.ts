import { createServiceClient } from "@/lib/supabase/service";

export async function upsertProEntitlement(userId: string, periodEnd: string) {
  const supabase = createServiceClient();
  await supabase.from("entitlements").upsert({
    user_id: userId,
    plan: "pro",
    status: "active",
    current_period_end: periodEnd,
    updated_at: new Date().toISOString(),
  });
}

export async function revokeProEntitlement(userId: string) {
  const supabase = createServiceClient();
  await supabase.from("entitlements").upsert({
    user_id: userId,
    plan: "free",
    status: "canceled",
    current_period_end: null,
    updated_at: new Date().toISOString(),
  });
}

export {
  isWebhookEventProcessed,
  markWebhookEventProcessed,
} from "@/lib/billing/webhook-idempotency";
