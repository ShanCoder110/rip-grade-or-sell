import { readDemoCollection, writeDemoCollection } from "@/lib/demo-data/storage";

export type DemoPortfolioRow = {
  cardId: string;
  quantity: number;
};

const COLLECTION = "portfolio";

export function listDemoPortfolio(demoId: string): DemoPortfolioRow[] {
  return readDemoCollection<DemoPortfolioRow[]>(demoId, COLLECTION, []);
}

function saveRows(demoId: string, rows: DemoPortfolioRow[]): DemoPortfolioRow[] {
  writeDemoCollection(demoId, COLLECTION, rows);
  return rows;
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
  return { merged: saveRows(demoId, merged), imported };
}

export function removeDemoPortfolioRow(demoId: string, cardId: string): DemoPortfolioRow[] {
  return saveRows(
    demoId,
    listDemoPortfolio(demoId).filter((r) => r.cardId !== cardId),
  );
}

export function updateDemoPortfolioRow(
  demoId: string,
  cardId: string,
  patch: { cardId?: string; quantity?: number },
): DemoPortfolioRow[] {
  const rows = listDemoPortfolio(demoId);
  const index = rows.findIndex((r) => r.cardId === cardId);
  if (index < 0) return rows;

  const nextCardId = patch.cardId?.trim() || cardId;
  const nextQty = patch.quantity ?? rows[index]!.quantity;
  if (!nextCardId || !Number.isFinite(nextQty) || nextQty <= 0) return rows;

  const without = rows.filter((r) => r.cardId !== cardId);
  if (without.some((r) => r.cardId === nextCardId && nextCardId !== cardId)) {
    return rows;
  }

  const updated = [...without, { cardId: nextCardId, quantity: nextQty }];
  updated.sort((a, b) => a.cardId.localeCompare(b.cardId));
  return saveRows(demoId, updated);
}

export function clearDemoPortfolio(demoId: string): DemoPortfolioRow[] {
  return saveRows(demoId, []);
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
