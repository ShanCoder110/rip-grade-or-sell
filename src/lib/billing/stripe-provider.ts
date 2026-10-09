import Stripe from "stripe";
import { env } from "@/env";
import { hasStripeCheckoutConfig } from "@/lib/auth/demo-mode";
import type { BillingProvider, CheckoutInterval, CheckoutSession } from "@/lib/billing/types";

function stripeClient(): Stripe {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(env.STRIPE_SECRET_KEY);
}

export class StripeBillingProvider implements BillingProvider {
  async createCheckout(
    userId: string,
    email: string,
    interval: CheckoutInterval,
  ): Promise<CheckoutSession> {
    if (!hasStripeCheckoutConfig()) {
      return { url: null, message: "Stripe price IDs are not configured." };
    }
    const price = interval === "year" ? env.STRIPE_PRICE_YEARLY! : env.STRIPE_PRICE_MONTHLY!;
    const stripe = stripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      client_reference_id: userId,
      metadata: { user_id: userId, interval },
      subscription_data: { metadata: { user_id: userId, interval } },
      line_items: [{ price, quantity: 1 }],
      success_url: `${env.NEXT_PUBLIC_APP_URL}/pricing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancel`,
    });
    return { url: session.url, message: "Redirecting to Stripe Checkout (test mode)." };
  }

  async createPortal(_userId: string, customerId: string): Promise<CheckoutSession> {
    if (!env.STRIPE_SECRET_KEY) {
      return { url: null, message: "Customer portal requires Stripe configuration." };
    }
    if (!customerId) {
      return { url: null, message: "No Stripe customer is stored for this account yet." };
    }
    const stripe = stripeClient();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${env.NEXT_PUBLIC_APP_URL}/pricing`,
    });
    return { url: session.url };
  }

  verifyWebhook(payload: string, signature: string): Stripe.Event {
    const secret = env.BILLING_WEBHOOK_SECRET;
    if (!secret) throw new Error("BILLING_WEBHOOK_SECRET not set");
    if (!signature) throw new Error("Missing signature");
    return stripeClient().webhooks.constructEvent(payload, signature, secret);
  }
}
