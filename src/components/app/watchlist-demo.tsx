"use client";

import { useCallback, useEffect, useState } from "react";
import { DemoLocalBanner } from "@/components/app/demo-local-banner";
import { EmptyState } from "@/components/empty-state";
import {
  addDemoWatchlistItem,
  listDemoWatchlist,
  removeDemoWatchlistItem,
  updateDemoWatchlistItem,
  type DemoWatchlistItem,
} from "@/lib/demo-data/watchlist";

const SAMPLE_CARD = {
  cardId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
  label: "Sample Rare Holo (#001)",
};

export function WatchlistDemo({ demoId }: { demoId: string }) {
  const [items, setItems] = useState<DemoWatchlistItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");

  const refresh = useCallback(() => {
    setItems(listDemoWatchlist(demoId));
  }, [demoId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function startEdit(item: DemoWatchlistItem) {
    setEditingId(item.id);
    setEditLabel(item.label);
  }

  function saveEdit(id: string) {
    if (!editLabel.trim()) return;
    setItems(updateDemoWatchlistItem(demoId, id, { label: editLabel.trim() }));
    setEditingId(null);
  }

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
            <li key={item.id} className="flex flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              {editingId === item.id ? (
                <>
                  <input
                    className="flex-1 rounded-lg border border-border px-2 py-1"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    aria-label="Watchlist label"
                  />
                  <div className="flex gap-3">
                    <button type="button" className="link text-xs" onClick={() => saveEdit(item.id)}>Save</button>
                    <button type="button" className="link text-xs" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <span>{item.label}</span>
                  <div className="flex gap-3 sm:ml-auto">
                    <button type="button" className="link text-xs" onClick={() => startEdit(item)}>Edit</button>
                    <button
                      type="button"
                      className="link text-xs"
                      onClick={() => setItems(removeDemoWatchlistItem(demoId, item.id))}
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
