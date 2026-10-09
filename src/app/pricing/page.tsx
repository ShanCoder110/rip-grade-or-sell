import Link from "next/link";
import type { Metadata } from "next";
import { PricingActions } from "@/components/pricing-actions";

export const metadata: Metadata = {
  title: "Pricing",
  alternates: { canonical: "/pricing" },
  description: "Free tools for EV and calculators. Pro adds watchlist, alerts, and portfolio.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">Pricing</h1>
      <p className="mt-2 text-muted-foreground">Cancel anytime. Billed through our payment provider.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold">Free</h2>
          <p className="mt-2 text-3xl font-bold">$0</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Set EV &amp; calculators</li>
            <li>Watchlist up to 5 cards</li>
            <li>30 days EV / price history</li>
          </ul>
        </div>
        <div className="rounded-lg border-2 border-primary p-6">
          <h2 className="text-xl font-semibold">Pro</h2>
          <p className="mt-2 text-3xl font-bold">$3<span className="text-base font-normal">/mo</span></p>
          <p className="text-sm text-muted-foreground">or $24/year</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Unlimited watchlist</li>
            <li>Full EV history</li>
            <li>Price / EV email alerts</li>
            <li>Portfolio + CSV import &amp; bulk grade triage</li>
          </ul>
          <PricingActions className="mt-6" />
        </div>
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        <Link href="/refund" className="underline">Refund policy</Link>
      </p>
    </div>
  );
}
