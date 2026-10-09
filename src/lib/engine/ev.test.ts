import { describe, expect, it } from "vitest";
import { DEFAULT_EV_CONFIG, grossEV, netEV, verdict } from "./ev";

describe("grossEV", () => {
  it("sums rarity contributions with integer rounding", () => {
    const rates = [
      { rarity: "Rare", odds: 6, priceCents: 300 },
      { rarity: "IR", odds: 12, priceCents: 1200 },
    ];
    // 36*(1/6)*300 + 36*(1/12)*1200 = 1800 + 3600 = 5400
    expect(grossEV(rates, 36)).toBe(5400);
  });

  it("ignores missing prices and zero odds", () => {
    expect(
      grossEV(
        [
          { rarity: "A", odds: 0, priceCents: 100 },
          { rarity: "B", odds: 6, priceCents: null },
        ],
        36,
      ),
    ).toBe(0);
  });
});

describe("netEV", () => {
  it("applies fees, shipping, and liquidity haircut", () => {
    const rates = [{ rarity: "Rare", odds: 6, priceCents: 400 }];
    const config = { ...DEFAULT_EV_CONFIG, packCount: 36, liquidityThresholdCents: 100 };
    const result = netEV(rates, config);
    expect(result.grossCents).toBe(2400);
    expect(result.netCents).toBeLessThan(result.grossCents);
  });
});

describe("verdict", () => {
  it("classifies rip/hold/skip by margin bps", () => {
    const cfg = DEFAULT_EV_CONFIG;
    expect(verdict(10000, 10600, cfg)).toBe("rip");
    expect(verdict(10000, 10000, cfg)).toBe("hold");
    expect(verdict(10000, 9000, cfg)).toBe("skip");
  });
});
