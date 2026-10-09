import { Suspense } from "react";
import type { Metadata } from "next";
import { GradeOrSellCalculator } from "@/components/tools/grade-or-sell-calculator";

export const metadata: Metadata = {
  title: "Grade or Sell Calculator",
  alternates: { canonical: "/tools/grade-or-sell" },
  description: "Compare raw sale vs expected graded net profit with fees and PSA costs.",
};

export default function GradeOrSellPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Grade or sell</h1>
      <p className="mt-2 text-muted-foreground">
        Free calculator — share results via URL parameters. Prices and fees are your inputs;
        grading odds are illustrative self-check mappings, not guarantees.
      </p>
      <Suspense fallback={<p className="mt-8 text-sm text-muted-foreground">Loading…</p>}>
        <GradeOrSellCalculator className="mt-8" />
      </Suspense>
    </div>
  );
}
