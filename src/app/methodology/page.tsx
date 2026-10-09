import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  alternates: { canonical: "/methodology" },
  description: "How we compute expected value, fees, and grading ROI.",
};

export default function MethodologyPage() {
  return (
    <div className="page-narrow prose-page">
      <h1>Methodology</h1>
      <p>
        Currency is stored and calculated in integer cents. Dollar amounts on screen are rounded
        only for reading.
      </p>

      <h2>Sealed product expected value</h2>
      <p>
        For each rarity <em>r</em> with published odds (1 hit per <em>N</em> packs) and market price{" "}
        <em>P</em> in cents:
      </p>
      <pre>
{`hits_r = packCount × (1 / N_r)
grossEV = round(Σ_r hits_r × P_r)

adjusted_r = liquidity haircut(P_r)
grossAdjusted = round(Σ_r hits_r × adjusted_r)
platformFees = round(grossAdjusted × platformFeeBps / 10_000)
shipping = Σ_r round(hits_r) × shippingPerCardCents
netEV = max(0, grossAdjusted − platformFees − shipping)

marginBps = round((netEV − sealedPrice) / sealedPrice × 10_000)
verdict = rip if marginBps ≥ ripMarginBps
        hold if marginBps ≥ holdMarginBps
        skip otherwise`}
      </pre>
      <p>
        If a card price is under the liquidity threshold, it is reduced by the haircut in basis
        points before EV. Defaults live in the EV engine and stay labeled sample until they are
        tuned against live fee tables.
      </p>

      <h2>Marketplace fees</h2>
      <p>
        Versioned schedules in the fee data folder carry an effective date. Net payout uses the
        rules in force on the sale date you pick and returns an itemized breakdown.
      </p>

      <h2>Grading ROI</h2>
      <p>
        Expected graded value blends PSA 9 and PSA 10 comps with a self-reported condition mapping.
        That mapping is illustrative. Compare expected graded net, after marketplace fees and
        submission cost, with selling the card raw.
      </p>

      <h2>Data freshness</h2>
      <p>
        Tables show the upstream source and the UTC capture time. Daily ingestion runs when the
        cron secret and API credentials are set.
      </p>
    </div>
  );
}
