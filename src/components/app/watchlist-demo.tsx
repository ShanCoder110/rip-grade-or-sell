"use client";

import { useCallback, useEffect, useState } from "react";
import { DemoLocalBanner } from "@/components/app/demo-local-banner";
import { EmptyState } from "@/components/empty-state";
import {
  addDemoWatchlistItem,
  listDemoWatchlist,
  removeDemoWatchlistItem,
  type DemoWatchlistItem,
} from "@/lib/demo-data/watchlist";

const SAMPLE_CARD = {
  cardId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
  label: "Sample Rare Holo (#001)",
};

export function WatchlistDemo({ demoId }: { demoId: string }) {
  const [items, setItems] = useState<DemoWatchlistItem[]>([]);

  const refresh = useCallback(() => {
    setItems(listDemoWatchlist(demoId));
  }, [demoId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div>
      <DemoLocalBanner />
      <p className="mt-4 text-sm text-muted-foreground">
        Track cards you care about. In demo mode, items stay on this device until you clear site data.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setItems(addDemoWatchlistItem(demoId, SAMPLE_CARD));
          }}
        >
          Add sample card
        </button>
      </div>
      {!items.length ? (
        <div className="mt-6">
          <EmptyState title="Nothing saved yet" body="Add the sample card or import from a set page when card save is wired." />
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <span>{item.label}</span>
              <button
                type="button"
                className="link text-xs"
                onClick={() => setItems(removeDemoWatchlistItem(demoId, item.id))}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
