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
        All currency values are stored and calculated in integer cents. Displayed amounts may
        round to dollars for readability.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Sealed product expected value</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          For each rarity <em>r</em> with published odds (1 hit per <em>N</em> packs) and market
          price <em>P<sub>r</sub></em> in cents:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`hits_r = packCount × (1 / N_r)
grossEV = round(Σ_r hits_r × P_r)

adjusted_r = liquidity haircut(P_r)  // see below
grossAdjusted = round(Σ_r hits_r × adjusted_r)
platformFees = round(grossAdjusted × platformFeeBps / 10_000)
shipping = Σ_r round(hits_r) × shippingPerCardCents
netEV = max(0, grossAdjusted − platformFees − shipping)

marginBps = round((netEV − sealedPrice) / sealedPrice × 10_000)
verdict = rip if marginBps ≥ ripMarginBps
        hold if marginBps ≥ holdMarginBps
        skip otherwise`}
        </pre>
        <p className="mt-3 text-sm text-muted-foreground">
          Liquidity haircut: if <em>P<sub>r</sub></em> is below{" "}
          <code>liquidityThresholdCents</code>, we reduce the price by{" "}
          <code>liquidityHaircutBps</code> basis points before EV. Default config lives in{" "}
          <code>src/lib/engine/ev.ts</code> and is labeled sample until tuned against live fee
          tables.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Marketplace fees</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Versioned JSON schedules in <code>/data/fees</code> with <code>effectiveFrom</code> dates.
          <code>netPayout()</code> selects the schedule in force on your chosen sale date and returns
          an itemized breakdown per platform.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Grading ROI</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Expected graded value blends PSA 9 / PSA 10 comps with a self-reported condition mapping
          (illustrative, not official gem rates). Compare expected graded net (after marketplace
          fees) minus submission costs to selling raw.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Data freshness</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tables show upstream source and UTC capture time. Daily ingestion runs when{" "}
          <code>CRON_SECRET</code> and API credentials are configured.
        </p>
      </section>
    </div>
  );
}
