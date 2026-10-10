import { hasPublicSupabaseConfig } from "@/env";
import { createClient } from "@/lib/supabase/server";
import { SEED_SETS } from "@/lib/data/seed-fallback";
import { getSetDetailFromSeed, shouldFallbackToSeedData } from "@/lib/data/sets-seed";
import type { SetDetail, SetSummary } from "@/lib/data/sets-types";

export type { SetDetail, SetSummary } from "@/lib/data/sets-types";

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
      if (!set) {
        if (shouldFallbackToSeedData()) return getSetDetailFromSeed(slug);
        return null;
      }

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

      if (!products.data?.length || !pull_rates.data?.length) {
        if (shouldFallbackToSeedData()) return getSetDetailFromSeed(slug);
        return null;
      }

      return {
        ...set,
        products: products.data as SetDetail["products"],
        cards: (cards.data ?? []) as SetDetail["cards"],
        pull_rates: pull_rates.data as SetDetail["pull_rates"],
        price_snapshots,
      };
    } catch {
      if (shouldFallbackToSeedData()) return getSetDetailFromSeed(slug);
    }
  }

  return getSetDetailFromSeed(slug);
}

export async function getAllSetSlugs(): Promise<string[]> {
  const sets = await listSets();
  return sets.map((s) => s.slug);
}
