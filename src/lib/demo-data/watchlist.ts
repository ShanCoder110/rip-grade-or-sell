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
  const updated = [next, ...items];
  writeDemoCollection(demoId, COLLECTION, updated);
  return updated;
}

export function removeDemoWatchlistItem(demoId: string, id: string): DemoWatchlistItem[] {
  const updated = listDemoWatchlist(demoId).filter((i) => i.id !== id);
  writeDemoCollection(demoId, COLLECTION, updated);
  return updated;
}
