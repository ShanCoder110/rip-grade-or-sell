import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/ad-slot";
import { FeeCalculator } from "@/components/tools/fee-calculator";
import { adSlots } from "@/lib/ads/slots";

export const metadata: Metadata = {
  title: "Marketplace Fee Calculator",
  alternates: { canonical: "/tools/fee-calculator" },
  description: "Ranked net payout across major TCG marketplaces with itemized fees.",
};

export default function FeeCalculatorPage() {
  return (
    <div className="page-narrow">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Free tool</p>
      <h1 className="h1 mt-2">Fee calculator</h1>
      <p className="lede">
        Schedules are sample rates with a source link and an effective date. Confirm them on the
        official page before you price a sale.
      </p>
      <div className="mt-8">
        <FeeCalculator />
      </div>
      <AdSlot slot={adSlots.toolBelowResults} format="rectangle" className="mt-10" />
    </div>
  );
}
