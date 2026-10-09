import { describe, expect, it } from "vitest";
import { FREE_HISTORY_DAYS, filterHistoryByPlan } from "./plan-limits";

describe("filterHistoryByPlan", () => {
  it("limits free users to 30 days", () => {
    const rows = [
      { captured_on: "2099-01-01" },
      { captured_on: "2000-01-01" },
    ];
    const filtered = filterHistoryByPlan(rows, "free");
    expect(filtered.length).toBe(1);
    expect(filtered[0]!.captured_on).toBe("2099-01-01");
  });

  it("allows full history for pro", () => {
    const rows = [{ captured_on: "2000-01-01" }];
    expect(filterHistoryByPlan(rows, "pro").length).toBe(1);
  });
});

describe("FREE_HISTORY_DAYS", () => {
  it("is 30", () => {
    expect(FREE_HISTORY_DAYS).toBe(30);
  });
});
