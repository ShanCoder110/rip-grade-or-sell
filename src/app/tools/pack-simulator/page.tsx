import type { Metadata } from "next";
import { PackSimulator } from "@/components/tools/pack-simulator";

export const metadata: Metadata = {
  title: "Pack Simulator",
  alternates: { canonical: "/tools/pack-simulator" },
  description: "Virtual pack openings using published pull rates and sample prices.",
};

export default function PackSimulatorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Pack simulator</h1>
      <PackSimulator />
    </div>
  );
}
