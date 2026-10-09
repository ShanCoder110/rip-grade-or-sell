import { NextResponse } from "next/server";
import { z } from "zod";
import { hasSupabaseConfig } from "@/env";
import { getBillingProvider } from "@/lib/billing";
import {
  isWebhookEventProcessed,
  markWebhookEventProcessed,
  revokeProEntitlement,
  upsertProEntitlement,
} from "@/lib/billing/entitlements-sync";

const eventSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.object({
      metadata: z
        .object({
          user_id: z.string().optional(),
          interval: z.string().optional(),
        })
        .nullable()
        .optional(),
      client_reference_id: z.string().nullable().optional(),
      current_period_end: z.number().optional(),
      status: z.string().optional(),
    }),
  }),
});

function periodEndIso(interval: string | undefined, unix: number | undefined): string {
  if (unix) return new Date(unix * 1000).toISOString();
  const days = interval === "year" ? 366 : 32;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature") ?? "";
  const payload = await request.text();

  try {
    const raw = getBillingProvider().verifyWebhook(payload, signature);
    const event = eventSchema.parse(raw);

    if (isWebhookEventProcessed(event.id)) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    const userId = event.data.object.metadata?.user_id ?? event.data.object.client_reference_id ?? undefined;
    const status = event.data.object.status;
    const canceled = status === "canceled" || status === "unpaid" || status === "incomplete_expired";

    if (hasSupabaseConfig() && userId) {
      if (event.type === "customer.subscription.deleted" || canceled) {
        await revokeProEntitlement(userId);
      } else if (
        event.type === "checkout.session.completed" ||
        event.type === "customer.subscription.created" ||
        event.type === "customer.subscription.updated"
      ) {
        await upsertProEntitlement(
          userId,
          periodEndIso(event.data.object.metadata?.interval, event.data.object.current_period_end),
        );
      }
    }

    markWebhookEventProcessed(event.id);
    return NextResponse.json({ received: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
