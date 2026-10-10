import {
  SEED_CARDS,
  SEED_PRICE_SNAPSHOTS,
  SEED_PRODUCTS,
  SEED_PULL_RATES,
  SEED_SETS,
} from "@/lib/data/seed-fallback";
import type { SetDetail } from "@/lib/data/sets-types";

/** When Supabase is configured but empty/unreachable, use seed data in dev/test. */
export function shouldFallbackToSeedData(): boolean {
  return process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
}

export function getSetDetailFromSeed(slug: string): SetDetail | null {
  const set = SEED_SETS.find((s) => s.slug === slug);
  if (!set) return null;
  const products = SEED_PRODUCTS.filter((p) => p.set_id === set.id);
  const cards = SEED_CARDS.filter((c) => c.set_id === set.id);
  const pull_rates = SEED_PULL_RATES.filter((r) => r.set_id === set.id);
  const price_snapshots = SEED_PRICE_SNAPSHOTS.filter(
    (p) =>
      cards.some((c) => c.id === p.card_id) ||
      products.some((pr) => pr.id === p.product_id),
  );

  if (!set.is_prerelease && (!products.length || !pull_rates.length)) {
    return null;
  }

  return {
    ...set,
    products,
    cards,
    pull_rates,
    price_snapshots,
  };
}
