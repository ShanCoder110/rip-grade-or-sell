import { Suspense } from "react";
import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/ad-slot";
import { GradeOrSellCalculator } from "@/components/tools/grade-or-sell-calculator";
import { adSlots } from "@/lib/ads/slots";

export const metadata: Metadata = {
  title: "Grade or Sell Calculator",
  alternates: { canonical: "/tools/grade-or-sell" },
  description: "Compare raw sale vs expected graded net profit with fees and PSA costs.",
};

export default function GradeOrSellPage() {
  return (
    <div className="page-narrow">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Free tool</p>
      <h1 className="h1 mt-2">Grade or sell</h1>
      <p className="lede">
        No account required. Share a result with the link. Grading odds are a self-check mapping,
        not a promise of a gem mint.
      </p>
      <Suspense fallback={<div className="skeleton mt-8 h-80 w-full" aria-busy="true" />}>
        <GradeOrSellCalculator className="mt-8" />
      </Suspense>
      <AdSlot slot={adSlots.toolBelowResults} format="rectangle" className="mt-10" />
    </div>
  );
}
