import { z } from "zod";
import { env } from "@/env";
import { fetchWithRetry } from "@/lib/sources/http";

const BASE = "https://api.pokemontcg.io/v2";

const setSchema = z.object({
  id: z.string(),
  name: z.string(),
  series: z.string().optional(),
  releaseDate: z.string().optional(),
});

const cardSchema = z.object({
  id: z.string(),
  name: z.string(),
  number: z.string(),
  rarity: z.string().optional(),
  set: z.object({ id: z.string() }),
  images: z.object({ small: z.string().url().optional() }).optional(),
  cardmarket: z
    .object({
      prices: z
        .object({
          averageSellPrice: z.number().optional(),
          trendPrice: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
  tcgplayer: z
    .object({
      prices: z
        .record(
          z.string(),
          z.object({
            market: z.number().optional(),
            low: z.number().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
});

const listResponse = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    data: z.array(item),
    page: z.number().optional(),
    totalCount: z.number().optional(),
  });

export type PokemonSet = z.infer<typeof setSchema>;
export type PokemonCard = z.infer<typeof cardSchema>;

function headers(): HeadersInit {
  const h: HeadersInit = { Accept: "application/json" };
  if (env.POKEMONTCG_API_KEY) {
    h["X-Api-Key"] = env.POKEMONTCG_API_KEY;
  }
  return h;
}

export async function fetchPokemonSets(page = 1, pageSize = 50): Promise<PokemonSet[]> {
  const url = `${BASE}/sets?page=${page}&pageSize=${pageSize}`;
  const res = await fetchWithRetry(url, { headers: headers() });
  if (!res.ok) throw new Error(`pokemontcg sets: ${res.status}`);
  const json = listResponse(setSchema).parse(await res.json());
  return json.data;
}

export async function fetchPokemonCardsForSet(
  setId: string,
  page = 1,
  pageSize = 250,
): Promise<PokemonCard[]> {
  const url = `${BASE}/cards?q=set.id:${setId}&page=${page}&pageSize=${pageSize}`;
  const res = await fetchWithRetry(url, { headers: headers() });
  if (!res.ok) throw new Error(`pokemontcg cards: ${res.status}`);
  const json = listResponse(cardSchema).parse(await res.json());
  return json.data;
}

/** Extract USD market price in cents when present (Cardmarket EUR ignored here). */
export function extractPriceCents(card: PokemonCard): number | null {
  const prices = card.tcgplayer?.prices;
  if (!prices) return null;
  for (const variant of Object.values(prices)) {
    const market = variant.market ?? variant.low;
    if (market != null && market > 0) {
      return Math.round(market * 100);
    }
  }
  const cm = card.cardmarket?.prices?.trendPrice ?? card.cardmarket?.prices?.averageSellPrice;
  if (cm != null && cm > 0) {
    return Math.round(cm * 100);
  }
  return null;
}
