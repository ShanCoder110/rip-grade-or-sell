/**
 * Sealed product expected value — all money in integer cents.
 *
 * grossEV = sum over rarities of (packs × P(hit per pack) × price_cents)
 * where P(hit per pack) = 1 / odds (odds = "1 in N packs").
 *
 * netEV applies:
 * - platformFeeBps on gross (seller marketplace fee on expected resale)
 * - shippingPerCardCents × expected hits (fulfillment)
 * - liquidityHaircutBps on card prices below liquidityThresholdCents
 *
 * verdict compares netEV to sealedPrice with marginBps thresholds.
 */

export type PullRateInput = {
  rarity: string;
  /** Packs per hit (e.g. 6 means 1-in-6 packs). Must be > 0 to contribute. */
  odds: number;
  priceCents: number | null;
};

export type EvConfig = {
  packCount: number;
  platformFeeBps: number;
  shippingPerCardCents: number;
  liquidityThresholdCents: number;
  liquidityHaircutBps: number;
  ripMarginBps: number;
  holdMarginBps: number;
};

export const DEFAULT_EV_CONFIG: EvConfig = {
  packCount: 36,
  platformFeeBps: 1300, // 13% — sample placeholder; verify against live fee tables
  shippingPerCardCents: 99,
  liquidityThresholdCents: 500,
  liquidityHaircutBps: 1500,
  ripMarginBps: 500,
  holdMarginBps: -200,
};

function applyLiquidityHaircut(priceCents: number, config: EvConfig): number {
  if (priceCents >= config.liquidityThresholdCents) return priceCents;
  return Math.round(priceCents * (1 - config.liquidityHaircutBps / 10_000));
}

export function expectedHitsPerPack(rate: PullRateInput): number {
  if (rate.odds <= 0) return 0;
  return 1 / rate.odds;
}

export function grossEV(rates: PullRateInput[], packCount: number): number {
  let total = 0;
  for (const rate of rates) {
    if (rate.odds <= 0 || rate.priceCents == null) continue;
    const hits = packCount * expectedHitsPerPack(rate);
    total += hits * rate.priceCents;
  }
  return Math.round(total);
}

export function netEV(
  rates: PullRateInput[],
  config: EvConfig,
): { grossCents: number; netCents: number; breakdown: { fees: number; shipping: number; haircuts: number } } {
  let gross = 0;
  let shipping = 0;
  let haircuts = 0;

  for (const rate of rates) {
    if (rate.odds <= 0 || rate.priceCents == null) continue;
    const hits = config.packCount * expectedHitsPerPack(rate);
    const adjusted = applyLiquidityHaircut(rate.priceCents, config);
    haircuts += Math.round(hits * (rate.priceCents - adjusted));
    gross += hits * adjusted;
    shipping += Math.round(hits) * config.shippingPerCardCents;
  }

  gross = Math.round(gross);
  const platformFees = Math.round(gross * (config.platformFeeBps / 10_000));
  const netCents = Math.max(0, gross - platformFees - shipping);

  return {
    grossCents: gross,
    netCents,
    breakdown: { fees: platformFees, shipping, haircuts },
  };
}

export type EvVerdict = "rip" | "hold" | "skip";

export function verdict(sealedPriceCents: number, netEvCents: number, config: EvConfig): EvVerdict {
  if (sealedPriceCents <= 0) return "skip";
  const marginBps = Math.round(((netEvCents - sealedPriceCents) / sealedPriceCents) * 10_000);
  if (marginBps >= config.ripMarginBps) return "rip";
  if (marginBps >= config.holdMarginBps) return "hold";
  return "skip";
}
