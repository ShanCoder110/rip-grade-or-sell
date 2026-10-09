/**
 * Mirrors supabase/seed.sql for builds and dev without a running Supabase stack.
 * All values are SAMPLE data — not live market prices or official pull rates.
 */

export const SEED_GAME = {
  id: "11111111-1111-4111-8111-111111111111",
  slug: "pokemon",
  name: "Pokémon TCG",
};

export const SEED_SETS = [
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    game_id: SEED_GAME.id,
    slug: "sample-stellar-crown",
    name: "Sample Set — Stellar Crown (demo)",
    release_date: "2024-09-13",
    is_prerelease: false,
  },
  {
    id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    game_id: SEED_GAME.id,
    slug: "delta-reign",
    name: "Delta Reign (pre-release template)",
    release_date: "2026-06-01",
    is_prerelease: true,
  },
] as const;

export const SEED_PRODUCTS = [
  {
    id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    set_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    slug: "booster-box",
    kind: "box" as const,
    name: "Sample Booster Box (36 packs)",
    msrp_cents: 14364,
    pack_count: 36,
  },
  {
    id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    set_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    slug: "etb",
    kind: "etb" as const,
    name: "Sample Elite Trainer Box",
    msrp_cents: 4999,
    pack_count: 9,
  },
];

export const SEED_PRERELEASE_EXPECTED_RARITIES = [
  { set_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", rarity: "Common", note: "Official list pending" },
  { set_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", rarity: "Rare", note: "Official list pending" },
  { set_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", rarity: "Ultra Rare", note: "Official list pending" },
];

export const SEED_CARDS = [
  {
    id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    set_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    number: "001",
    name: "Sample Rare Holo",
    rarity: "Rare Holo",
    image_url: null,
    external_ids: { pokemontcg: "sample-001" },
  },
  {
    id: "ffffffff-ffff-4fff-8fff-ffffffffffff",
    set_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    number: "002",
    name: "Sample Illustration Rare",
    rarity: "Illustration Rare",
    image_url: null,
    external_ids: { pokemontcg: "sample-002" },
  },
];

export const SEED_PULL_RATES = [
  {
    set_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    product_id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    rarity: "Rare Holo",
    odds: 6,
    source_url: "https://example.com/sample-pull-rate-source",
    source_date: "2024-01-01",
    confidence: "sample",
  },
  {
    set_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    product_id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    rarity: "Illustration Rare",
    odds: 12,
    source_url: "https://example.com/sample-pull-rate-source",
    source_date: "2024-01-01",
    confidence: "sample",
  },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

export const SEED_PRICE_SNAPSHOTS = [
  {
    card_id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    product_id: null as string | null,
    source: "seed_sample",
    price_cents: 350,
    captured_on: daysAgo(5),
  },
  {
    card_id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    product_id: null,
    source: "seed_sample",
    price_cents: 375,
    captured_on: daysAgo(0),
  },
  {
    card_id: "ffffffff-ffff-4fff-8fff-ffffffffffff",
    product_id: null,
    source: "seed_sample",
    price_cents: 1200,
    captured_on: daysAgo(0),
  },
  {
    card_id: null,
    product_id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    source: "seed_sample",
    price_cents: 12999,
    captured_on: daysAgo(0),
  },
  {
    card_id: null,
    product_id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    source: "seed_sample",
    price_cents: 4499,
    captured_on: daysAgo(0),
  },
];
