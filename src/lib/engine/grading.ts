import { netPayout, type Platform } from "@/lib/engine/fees";

export type ConditionKey = "mint" | "nm" | "lp" | "mp" | "hp";

/** Sample grade probabilities by self-reported condition — not official PSA odds. */
export const CONDITION_GRADE_PROBS: Record<
  ConditionKey,
  { psa9: number; psa10: number }
> = {
  mint: { psa9: 0.35, psa10: 0.45 },
  nm: { psa9: 0.45, psa10: 0.25 },
  lp: { psa9: 0.55, psa10: 0.08 },
  mp: { psa9: 0.4, psa10: 0.02 },
  hp: { psa9: 0.15, psa10: 0.005 },
};

export type GradeOrSellInput = {
  rawPriceCents: number;
  psa9PriceCents: number;
  psa10PriceCents: number;
  gradingFeeCents: number;
  shippingInsuranceCents: number;
  platform: Platform;
  condition: ConditionKey;
};

export function expectedGradedValueCents(input: GradeOrSellInput): number {
  const p = CONDITION_GRADE_PROBS[input.condition];
  const failProb = Math.max(0, 1 - p.psa9 - p.psa10);
  const rawFallback = input.rawPriceCents;
  return Math.round(
    p.psa9 * input.psa9PriceCents + p.psa10 * input.psa10PriceCents + failProb * rawFallback,
  );
}

export function gradeOrSellAnalysis(input: GradeOrSellInput) {
  const sellRaw = netPayout({
    platform: input.platform,
    priceCents: input.rawPriceCents,
    shippingCents: 0,
  });

  const gradedValue = expectedGradedValueCents(input);
  const sellGraded = netPayout({
    platform: input.platform,
    priceCents: gradedValue,
    shippingCents: 0,
  });

  const totalCosts = input.gradingFeeCents + input.shippingInsuranceCents;
  const expectedNetProfit = sellGraded.netCents - totalCosts - sellRaw.netCents;

  const breakEvenPsa10Prob = breakEvenPsa10Probability(input);

  return {
    sellRawNet: sellRaw.netCents,
    expectedGradedNet: sellGraded.netCents,
    totalCosts,
    expectedNetProfit,
    breakEvenPsa10Prob,
    gradedValue,
  };
}

/** Solve for PSA-10 probability (holding PSA-9 prob fixed) needed to match raw net. */
export function breakEvenPsa10Probability(input: GradeOrSellInput): number {
  const p = CONDITION_GRADE_PROBS[input.condition];
  const rawNet = netPayout({
    platform: input.platform,
    priceCents: input.rawPriceCents,
    shippingCents: 0,
  }).netCents;
  const costs = input.gradingFeeCents + input.shippingInsuranceCents;
  const targetGradedGross = rawNet + costs;
  const failProb = Math.max(0, 1 - p.psa9 - p.psa10);
  const base =
    p.psa9 * input.psa9PriceCents +
    failProb * input.rawPriceCents +
    (1 - p.psa9 - failProb) * 0; // placeholder for psa10 variable

  const numerator = targetGradedGross - base;
  const denom = input.psa10PriceCents;
  if (denom <= 0) return 1;
  const prob = numerator / denom;
  return Math.min(1, Math.max(0, prob));
}
