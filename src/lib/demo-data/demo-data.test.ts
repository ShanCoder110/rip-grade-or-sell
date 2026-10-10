/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from "vitest";
import { addDemoWatchlistItem, listDemoWatchlist } from "./watchlist";
import { mergeDemoPortfolioImport, parsePortfolioCsv } from "./portfolio";
import { addDemoAlert, listDemoAlerts } from "./alerts";

const DEMO_ID = "test-demo-id";

describe("demo local data", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists watchlist per demo id", () => {
    addDemoWatchlistItem(DEMO_ID, { cardId: "c1", label: "Sample Rare Holo" });
    expect(listDemoWatchlist(DEMO_ID)).toHaveLength(1);
    expect(listDemoWatchlist("other")).toHaveLength(0);
  });

  it("imports portfolio csv rows", () => {
    const rows = parsePortfolioCsv("card_id,quantity\nc1,2\nc2,1");
    const { imported, merged } = mergeDemoPortfolioImport(DEMO_ID, rows);
    expect(imported).toBe(2);
    expect(merged).toHaveLength(2);
  });

  it("stores alert rules", () => {
    addDemoAlert(DEMO_ID, { label: "PSA 10 dip", thresholdCents: 5000 });
    expect(listDemoAlerts(DEMO_ID)).toHaveLength(1);
  });
});
