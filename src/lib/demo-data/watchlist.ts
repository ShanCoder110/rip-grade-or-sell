import { readDemoCollection, writeDemoCollection } from "@/lib/demo-data/storage";

export type DemoWatchlistItem = {
  id: string;
  cardId: string;
  label: string;
  addedAt: string;
};

const COLLECTION = "watchlist";

export function listDemoWatchlist(demoId: string): DemoWatchlistItem[] {
  return readDemoCollection<DemoWatchlistItem[]>(demoId, COLLECTION, []);
}

function saveWatchlist(demoId: string, items: DemoWatchlistItem[]): DemoWatchlistItem[] {
  writeDemoCollection(demoId, COLLECTION, items);
  return items;
}

export function addDemoWatchlistItem(
  demoId: string,
  item: Omit<DemoWatchlistItem, "id" | "addedAt">,
): DemoWatchlistItem[] {
  const items = listDemoWatchlist(demoId);
  if (items.some((i) => i.cardId === item.cardId)) return items;
  const next: DemoWatchlistItem = {
    ...item,
    id: crypto.randomUUID(),
    addedAt: new Date().toISOString(),
  };
  return saveWatchlist(demoId, [next, ...items]);
}

export function updateDemoWatchlistItem(
  demoId: string,
  id: string,
  patch: { label?: string; cardId?: string },
): DemoWatchlistItem[] {
  const items = listDemoWatchlist(demoId);
  const index = items.findIndex((i) => i.id === id);
  if (index < 0) return items;

  const current = items[index]!;
  const nextCardId = patch.cardId?.trim() || current.cardId;
  const nextLabel = patch.label?.trim() || current.label;
  if (!nextCardId || !nextLabel) return items;

  if (
    nextCardId !== current.cardId &&
    items.some((i) => i.id !== id && i.cardId === nextCardId)
  ) {
    return items;
  }

  const updated = items.map((i) =>
    i.id === id ? { ...i, cardId: nextCardId, label: nextLabel } : i,
  );
  return saveWatchlist(demoId, updated);
}

export function removeDemoWatchlistItem(demoId: string, id: string): DemoWatchlistItem[] {
  return saveWatchlist(
    demoId,
    listDemoWatchlist(demoId).filter((i) => i.id !== id),
  );
}
