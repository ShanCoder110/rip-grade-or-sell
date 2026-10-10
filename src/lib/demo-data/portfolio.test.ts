/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from "vitest";
import {
  clearDemoPortfolio,
  listDemoPortfolio,
  mergeDemoPortfolioImport,
  removeDemoPortfolioRow,
  updateDemoPortfolioRow,
} from "./portfolio";

const DEMO_ID = "portfolio-test";

describe("demo portfolio lib", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("removes a row by card id", () => {
    mergeDemoPortfolioImport(DEMO_ID, [{ cardId: "c1", quantity: 2 }]);
    removeDemoPortfolioRow(DEMO_ID, "c1");
    expect(listDemoPortfolio(DEMO_ID)).toHaveLength(0);
  });

  it("updates quantity and card id", () => {
    mergeDemoPortfolioImport(DEMO_ID, [{ cardId: "c1", quantity: 2 }]);
    updateDemoPortfolioRow(DEMO_ID, "c1", { quantity: 5 });
    expect(listDemoPortfolio(DEMO_ID)[0]?.quantity).toBe(5);
    updateDemoPortfolioRow(DEMO_ID, "c1", { cardId: "c2", quantity: 3 });
    expect(listDemoPortfolio(DEMO_ID)).toEqual([{ cardId: "c2", quantity: 3 }]);
  });

  it("clears all rows", () => {
    mergeDemoPortfolioImport(DEMO_ID, [{ cardId: "c1", quantity: 1 }]);
    clearDemoPortfolio(DEMO_ID);
    expect(listDemoPortfolio(DEMO_ID)).toHaveLength(0);
  });
});
