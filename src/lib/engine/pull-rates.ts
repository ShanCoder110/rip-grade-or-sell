export type PullRateRow = {
  product_id: string | null;
  rarity: string;
  odds: number;
  source_url: string;
  source_date: string;
  confidence: string;
};

export type ProductRef = { id: string; name: string; slug: string };

export type ResolvedProductPullRates = {
  rates: PullRateRow[];
  scope: "product" | "fallback";
  /** When scope is fallback, which product's rates were borrowed. */
  fallbackProductName: string | null;
  sourceUrl: string;
  sourceDate: string;
};

/**
 * Prefer pull rates scoped to the product. If none exist, fall back to booster-box rates
 * (or the first product in the set that has rates) and mark scope as fallback.
 */
export function resolvePullRatesForProduct(
  allRates: PullRateRow[],
  productId: string,
  products: ProductRef[],
): ResolvedProductPullRates | null {
  const forProduct = allRates.filter((r) => r.product_id === productId);
  if (forProduct.length) {
    const first = forProduct[0]!;
    return {
      rates: forProduct,
      scope: "product",
      fallbackProductName: null,
      sourceUrl: first.source_url,
      sourceDate: first.source_date,
    };
  }

  const fallbackProduct =
    products.find((p) => p.slug === "booster-box") ??
    products.find((p) => allRates.some((r) => r.product_id === p.id));
  if (!fallbackProduct) return null;

  const fallbackRates = allRates.filter((r) => r.product_id === fallbackProduct.id);
  if (!fallbackRates.length) return null;

  const first = fallbackRates[0]!;
  return {
    rates: fallbackRates,
    scope: "fallback",
    fallbackProductName: fallbackProduct.name,
    sourceUrl: first.source_url,
    sourceDate: first.source_date,
  };
}

export function pullRateDisclaimer(resolved: ResolvedProductPullRates, productName: string): string {
  if (resolved.scope === "product") {
    return `Pull rates are specific to ${productName} (source dated ${resolved.sourceDate}).`;
  }
  return `No pull rates are published for ${productName}. EV uses rates from ${resolved.fallbackProductName ?? "another product in this set"} (source dated ${resolved.sourceDate}) until product-specific data is available.`;
}
