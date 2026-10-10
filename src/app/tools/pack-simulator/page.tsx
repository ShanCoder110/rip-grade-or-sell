import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/ad-slot";
import { PackSimulator } from "@/components/tools/pack-simulator";
import { adSlots } from "@/lib/ads/slots";

export const metadata: Metadata = {
  title: "Pack Simulator",
  alternates: { canonical: "/tools/pack-simulator" },
  description: "Virtual pack openings using published pull rates and sample prices.",
};

export default function PackSimulatorPage() {
  return (
    <div className="page-narrow">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Free tool</p>
      <h1 className="h1 mt-2">Pack simulator</h1>
      <div className="mt-6">
        <PackSimulator />
      </div>
      <AdSlot slot={adSlots.toolBelowResults} format="rectangle" className="mt-10" />
    </div>
  );
}
