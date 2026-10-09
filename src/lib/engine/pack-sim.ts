export type PackSlot = { rarity: string; odds: number; valueCents: number };

export type SimPullRate = { rarity: string; odds: number };

/** Weighted random: pick rarity by inverse odds. */
export function simulatePack(
  rates: SimPullRate[],
  pricesByRarity: Map<string, number>,
  rng: () => number = Math.random,
): { slots: PackSlot[]; totalCents: number } {
  const weights = rates.map((r) => (r.odds > 0 ? 1 / r.odds : 0));
  const sum = weights.reduce((a, b) => a + b, 0);
  const slots: PackSlot[] = [];
  let total = 0;

  // Simplified: one hit slot per pack plus bulk commons at 0 sample value
  const roll = rng() * sum;
  let acc = 0;
  let picked = rates[0]!;
  for (let i = 0; i < rates.length; i++) {
    acc += weights[i]!;
    if (roll <= acc) {
      picked = rates[i]!;
      break;
    }
  }
  const value = pricesByRarity.get(picked.rarity) ?? 0;
  slots.push({ rarity: picked.rarity, odds: picked.odds, valueCents: value });
  total += value;

  return { slots, totalCents: total };
}
