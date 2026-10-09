import { z } from "zod";
import { fetchWithRetry } from "@/lib/sources/http";

const priceRowSchema = z.object({
  uuid: z.string(),
  usd: z.number().nullable().optional(),
  usdFoil: z.number().nullable().optional(),
});

const allPricesSchema = z.object({
  meta: z.object({ date: z.string().optional() }).optional(),
  data: z.record(z.string(), priceRowSchema),
});

export type MtgJsonPrices = z.infer<typeof allPricesSchema>;

const MTGJSON_ALL_PRICES =
  "https://mtgjson.com/api/v5/AllPrices.json";

export async function fetchMtgJsonAllPrices(): Promise<MtgJsonPrices> {
  const res = await fetchWithRetry(MTGJSON_ALL_PRICES, { retries: 2, backoffMs: 1000 });
  if (!res.ok) throw new Error(`MTGJSON AllPrices: ${res.status}`);
  const json = await res.json();
  return allPricesSchema.parse(json);
}

export function mtgPriceCents(row: z.infer<typeof priceRowSchema>): number | null {
  const usd = row.usd ?? row.usdFoil;
  if (usd == null || usd <= 0) return null;
  return Math.round(usd * 100);
}
