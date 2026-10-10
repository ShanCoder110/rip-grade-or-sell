import { describe, expect, it } from "vitest";
import { getSetDetailFromSeed, shouldFallbackToSeedData } from "./sets-seed";

describe("getSetDetailFromSeed", () => {
  it("returns sample set data for known slug", () => {
    const detail = getSetDetailFromSeed("sample-stellar-crown");
    expect(detail).not.toBeNull();
    expect(detail?.slug).toBe("sample-stellar-crown");
    expect(detail?.products.length).toBeGreaterThan(0);
    expect(detail?.pull_rates.length).toBeGreaterThan(0);
  });

  it("returns null for unknown slug", () => {
    expect(getSetDetailFromSeed("not-a-real-set")).toBeNull();
  });
});

describe("shouldFallbackToSeedData", () => {
  it("is true in vitest (NODE_ENV=test)", () => {
    expect(shouldFallbackToSeedData()).toBe(true);
  });
});
