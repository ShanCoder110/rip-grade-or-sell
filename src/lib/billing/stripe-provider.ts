import { env } from "@/env";
import type { BillingProvider, CheckoutInterval, CheckoutSession } from "@/lib/billing/types";

export class StripeBillingProvider implements BillingProvider {
  async createCheckout(
    _userId: string,
    _email: string,
    interval: CheckoutInterval,
  ): Promise<CheckoutSession> {
    if (!env.STRIPE_SECRET_KEY || !env.NEXT_PUBLIC_APP_URL) {
      return {
        url: null,
        message: "Billing is not configured. Add Stripe keys to enable checkout.",
      };
    }
    const price =
      interval === "year" ? env.STRIPE_PRICE_YEARLY : env.STRIPE_PRICE_MONTHLY;
    if (!price) {
      return { url: null, message: "Stripe price IDs are not configured." };
    }
    // TODO: create real Stripe Checkout Session via REST when credentials are present.
    return {
      url: `${env.NEXT_PUBLIC_APP_URL}/pricing?checkout=mock&interval=${interval}`,
      message: "Mock checkout URL — wire Stripe SDK in production.",
    };
  }

  async createPortal(_userId: string, _customerId: string): Promise<CheckoutSession> {
    return { url: null, message: "Customer portal requires Stripe configuration." };
  }

  verifyWebhook(payload: string, signature: string): unknown {
    if (!env.BILLING_WEBHOOK_SECRET) {
      throw new Error("BILLING_WEBHOOK_SECRET not set");
    }
    if (!signature) throw new Error("Missing signature");
    return JSON.parse(payload);
  }
}
