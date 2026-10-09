import { DEFAULT_EV_CONFIG, grossEV, netEV, verdict, type PullRateInput } from "@/lib/engine/ev";

export function buildPullRateInputs(
  pullRates: { rarity: string; odds: number }[],
  pricesByRarity: Map<string, number>,
): PullRateInput[] {
  return pullRates.map((pr) => ({
    rarity: pr.rarity,
    odds: pr.odds,
    priceCents: pricesByRarity.get(pr.rarity) ?? null,
  }));
}

export function computeProductEv(
  pullRates: { rarity: string; odds: number }[],
  pricesByRarity: Map<string, number>,
  packCount: number,
  sealedPriceCents: number,
) {
  const rates = buildPullRateInputs(pullRates, pricesByRarity);
  const config = { ...DEFAULT_EV_CONFIG, packCount };
  const gross = grossEV(rates, packCount);
  const net = netEV(rates, config);
  const v = verdict(sealedPriceCents, net.netCents, config);
  return { gross, net, verdict: v, rates };
}

export function latestCardPrices(
  snapshots: {
    card_id: string | null;
    price_cents: number;
    captured_on: string;
    source: string;
  }[],
  cards: { id: string; rarity: string }[],
): Map<string, number> {
  const byCard = new Map<string, { price_cents: number; captured_on: string }>();
  for (const s of snapshots) {
    if (!s.card_id) continue;
    const prev = byCard.get(s.card_id);
    if (!prev || s.captured_on >= prev.captured_on) {
      byCard.set(s.card_id, { price_cents: s.price_cents, captured_on: s.captured_on });
    }
  }
  const byRarity = new Map<string, number>();
  for (const card of cards) {
    const p = byCard.get(card.id);
    if (!p) continue;
    const existing = byRarity.get(card.rarity);
    if (existing == null || p.price_cents > existing) {
      byRarity.set(card.rarity, p.price_cents);
    }
  }
  return byRarity;
}

export function latestProductPrice(
  snapshots: {
    product_id: string | null;
    price_cents: number;
    captured_on: string;
  }[],
  productId: string,
): number | null {
  const rows = snapshots.filter((s) => s.product_id === productId);
  if (!rows.length) return null;
  rows.sort((a, b) => b.captured_on.localeCompare(a.captured_on));
  return rows[0]!.price_cents;
}
