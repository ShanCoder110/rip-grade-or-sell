import { env } from "@/env";
import { StripeBillingProvider } from "@/lib/billing/stripe-provider";
import type { BillingProvider } from "@/lib/billing/types";

export function getBillingProvider(): BillingProvider {
  const provider = env.BILLING_PROVIDER ?? "stripe";
  switch (provider) {
    case "stripe":
    default:
      return new StripeBillingProvider();
  }
}
