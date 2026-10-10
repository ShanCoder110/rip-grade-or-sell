import { describe, expect, it } from "vitest";
import { pullRateDisclaimer, resolvePullRatesForProduct } from "./pull-rates";

const products = [
  { id: "box", name: "Booster Box", slug: "booster-box" },
  { id: "etb", name: "ETB", slug: "etb" },
];

const rates = [
  {
    product_id: "box",
    rarity: "Rare",
    odds: 6,
    source_url: "https://example.com/rates",
    source_date: "2024-01-01",
    confidence: "sample",
  },
];

describe("resolvePullRatesForProduct", () => {
  it("returns product-scoped rates when present", () => {
    const resolved = resolvePullRatesForProduct(rates, "box", products);
    expect(resolved?.scope).toBe("product");
    expect(resolved?.rates).toHaveLength(1);
  });

  it("falls back to booster box rates for ETB", () => {
    const resolved = resolvePullRatesForProduct(rates, "etb", products);
    expect(resolved?.scope).toBe("fallback");
    expect(resolved?.fallbackProductName).toBe("Booster Box");
    expect(resolved?.rates).toHaveLength(1);
  });
});

describe("pullRateDisclaimer", () => {
  it("mentions fallback product", () => {
    const resolved = resolvePullRatesForProduct(rates, "etb", products)!;
    expect(pullRateDisclaimer(resolved, "ETB")).toMatch(/Booster Box/);
  });
});
