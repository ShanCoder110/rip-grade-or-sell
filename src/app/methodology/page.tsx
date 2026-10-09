import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  alternates: { canonical: "/methodology" },
  description: "How we compute expected value, fees, and grading ROI.",
};

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Methodology</h1>
      <p className="mt-4 text-muted-foreground">
        Detailed formulas for gross EV, net EV, marketplace fees, and grading ROI are documented
        here as each engine ships. All currency values are stored and calculated in integer cents;
        displayed amounts are rounded for readability only.
      </p>
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Expected value (sealed product)</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          See the EV engine section below once pull-rate and price data are wired (Prompt 4).
        </p>
      </section>
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Marketplace fees</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Fee schedules are versioned JSON with effective dates; net payout uses the rules in force on
          your chosen sale date.
        </p>
      </section>
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Data freshness</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Every chart and table shows the upstream source and UTC timestamp of the underlying
          snapshot. Ingestion runs daily when API keys and cron credentials are configured.
        </p>
      </section>
    </div>
  );
}
