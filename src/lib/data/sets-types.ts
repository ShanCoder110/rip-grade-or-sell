import type {
  SEED_CARDS,
  SEED_PRICE_SNAPSHOTS,
  SEED_PRODUCTS,
  SEED_PULL_RATES,
  SEED_SETS,
} from "@/lib/data/seed-fallback";

export type SetSummary = {
  id: string;
  slug: string;
  name: string;
  release_date: string | null;
  is_prerelease: boolean;
};

export type SetDetail = SetSummary & {
  products: (typeof SEED_PRODUCTS)[number][];
  cards: (typeof SEED_CARDS)[number][];
  pull_rates: (typeof SEED_PULL_RATES)[number][];
  price_snapshots: (typeof SEED_PRICE_SNAPSHOTS)[number][];
};

export type SeedSet = (typeof SEED_SETS)[number];
