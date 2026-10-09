import { describe, expect, it } from "vitest";
import { netPayout, rankPlatforms } from "./index";

const platforms = ["ebay", "tcgplayer", "whatnot", "mercari", "paypal"] as const;

describe("netPayout", () => {
  for (const platform of platforms) {
    it(`returns itemized breakdown for ${platform}`, () => {
      const result = netPayout({
        platform,
        priceCents: 5000,
        shippingCents: 499,
        date: "2025-01-01",
      });
      expect(result.netCents).toBeLessThan(5499);
      expect(result.lines.length).toBeGreaterThan(0);
      expect(result.sourceUrl).toMatch(/^https?:\/\//);
    });
  }
});

describe("rankPlatforms", () => {
  it("orders by highest net", () => {
    const ranked = rankPlatforms({ priceCents: 10000, shippingCents: 0 });
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i - 1]!.netCents).toBeGreaterThanOrEqual(ranked[i]!.netCents);
    }
  });
});
