import { readDemoCollection, writeDemoCollection } from "@/lib/demo-data/storage";

export type DemoPortfolioRow = {
  cardId: string;
  quantity: number;
};

const COLLECTION = "portfolio";

export function listDemoPortfolio(demoId: string): DemoPortfolioRow[] {
  return readDemoCollection<DemoPortfolioRow[]>(demoId, COLLECTION, []);
}

export function mergeDemoPortfolioImport(
  demoId: string,
  rows: DemoPortfolioRow[],
): { merged: DemoPortfolioRow[]; imported: number } {
  const existing = new Map(listDemoPortfolio(demoId).map((r) => [r.cardId, r.quantity]));
  let imported = 0;
  for (const row of rows) {
    if (!row.cardId || !Number.isFinite(row.quantity) || row.quantity <= 0) continue;
    const prev = existing.get(row.cardId) ?? 0;
    if (prev === 0) imported += 1;
    existing.set(row.cardId, prev + row.quantity);
  }
  const merged = [...existing.entries()].map(([cardId, quantity]) => ({ cardId, quantity }));
  writeDemoCollection(demoId, COLLECTION, merged);
  return { merged, imported };
}

export function parsePortfolioCsv(text: string): DemoPortfolioRow[] {
  const lines = text.trim().split(/\r?\n/).slice(1);
  const rows: DemoPortfolioRow[] = [];
  for (const line of lines) {
    const [card_id, quantity] = line.split(",");
    if (!card_id?.trim() || !quantity?.trim()) continue;
    const qty = Number(quantity);
    if (!Number.isFinite(qty)) continue;
    rows.push({ cardId: card_id.trim(), quantity: qty });
  }
  return rows;
}
