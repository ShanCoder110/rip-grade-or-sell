import { NextResponse } from "next/server";
import { z } from "zod";
import { getBillingProvider } from "@/lib/billing";
import {
  isWebhookEventProcessed,
  markWebhookEventProcessed,
  upsertProEntitlement,
} from "@/lib/billing/entitlements-sync";
import { hasSupabaseConfig } from "@/env";

const eventSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.object({
      metadata: z.object({ user_id: z.string().optional() }).optional(),
      current_period_end: z.number().optional(),
    }),
  }),
});

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature") ?? "";
  const payload = await request.text();

  try {
    const raw = getBillingProvider().verifyWebhook(payload, signature);
    const event = eventSchema.parse(raw);

    if (isWebhookEventProcessed(event.id)) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    if (event.type === "checkout.session.completed" || event.type === "customer.subscription.updated") {
      const userId = event.data.object.metadata?.user_id;
      const periodEnd = event.data.object.current_period_end;
      if (userId && periodEnd && hasSupabaseConfig()) {
        await upsertProEntitlement(userId, new Date(periodEnd * 1000).toISOString());
      }
    }

    markWebhookEventProcessed(event.id);
    return NextResponse.json({ received: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
