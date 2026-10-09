import { hasPublicSupabaseConfig } from "@/env";
import { createClient } from "@/lib/supabase/server";
import {
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

async function fromSupabase(): Promise<SetSummary[] | null> {
  if (!hasPublicSupabaseConfig()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sets")
      .select("id, slug, name, release_date, is_prerelease")
      .order("release_date", { ascending: false });
    if (error || !data?.length) return null;
    return data;
  } catch {
    return null;
  }
}

export async function listSets(): Promise<SetSummary[]> {
  const remote = await fromSupabase();
  if (remote) return remote;
  return [...SEED_SETS];
}

export async function getSetBySlug(slug: string): Promise<SetDetail | null> {
  if (hasPublicSupabaseConfig()) {
    try {
      const supabase = await createClient();
      const { data: set } = await supabase
        .from("sets")
        .select("id, slug, name, release_date, is_prerelease")
        .eq("slug", slug)
        .maybeSingle();
      if (!set) return null;

      const [products, cards, pull_rates, prices] = await Promise.all([
        supabase.from("products").select("*").eq("set_id", set.id),
        supabase.from("cards").select("*").eq("set_id", set.id),
        supabase.from("pull_rates").select("*").eq("set_id", set.id),
        supabase
          .from("price_snapshots")
          .select("*")
          .in(
            "card_id",
            (
              await supabase.from("cards").select("id").eq("set_id", set.id)
            ).data?.map((c) => c.id) ?? [],
          ),
      ]);

      const productPrices = await supabase
        .from("price_snapshots")
        .select("*")
        .in("product_id", products.data?.map((p) => p.id) ?? []);

      const price_snapshots = [
        ...(prices.data ?? []),
        ...(productPrices.data ?? []),
      ] as SetDetail["price_snapshots"];

      if (!products.data?.length || !pull_rates.data?.length) return null;

      return {
        ...set,
        products: products.data as SetDetail["products"],
        cards: (cards.data ?? []) as SetDetail["cards"],
        pull_rates: pull_rates.data as SetDetail["pull_rates"],
        price_snapshots,
      };
    } catch {
      // fall through to seed
    }
  }

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

  if (!products.length || (!pull_rates.length && !set.is_prerelease)) {
    if (!set.is_prerelease && !pull_rates.length) return null;
  }

  return {
    ...set,
    products,
    cards,
    pull_rates,
    price_snapshots,
  };
}

export async function getAllSetSlugs(): Promise<string[]> {
  const sets = await listSets();
  return sets.map((s) => s.slug);
}
