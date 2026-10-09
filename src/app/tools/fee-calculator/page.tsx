import type { Metadata } from "next";
import { FeeCalculator } from "@/components/tools/fee-calculator";

export const metadata: Metadata = {
  title: "Marketplace Fee Calculator",
  alternates: { canonical: "/tools/fee-calculator" },
  description: "Ranked net payout across major TCG marketplaces with itemized fees.",
};

export default function FeeCalculatorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Fee calculator</h1>
      <p className="mt-2 text-muted-foreground">
        Sample fee schedules with TODOs linked to official sources — verify before relying on
        numbers.
      </p>
      <FeeCalculator />
    </div>
  );
}
