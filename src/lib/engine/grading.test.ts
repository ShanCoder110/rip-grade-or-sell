import { describe, expect, it } from "vitest";
import { gradeOrSellAnalysis } from "./grading";

describe("gradeOrSellAnalysis", () => {
  it("computes expected profit vs raw sale", () => {
    const result = gradeOrSellAnalysis({
      rawPriceCents: 2000,
      psa9PriceCents: 3500,
      psa10PriceCents: 8000,
      gradingFeeCents: 2500,
      shippingInsuranceCents: 500,
      platform: "tcgplayer",
      condition: "nm",
    });
    expect(result.sellRawNet).toBeGreaterThan(0);
    expect(result.expectedNetProfit).toBeTypeOf("number");
    expect(result.breakEvenPsa10Prob).toBeGreaterThanOrEqual(0);
    expect(result.breakEvenPsa10Prob).toBeLessThanOrEqual(1);
  });
});
