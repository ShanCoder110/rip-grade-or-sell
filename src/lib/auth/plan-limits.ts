export type UserPlan = "free" | "pro";

export const FREE_HISTORY_DAYS = 30;

export function filterHistoryByPlan<T extends { captured_on: string }>(
  rows: T[],
  plan: UserPlan,
): T[] {
  if (plan === "pro") return rows;
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - FREE_HISTORY_DAYS);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  return rows.filter((r) => r.captured_on >= cutoffStr);
}
