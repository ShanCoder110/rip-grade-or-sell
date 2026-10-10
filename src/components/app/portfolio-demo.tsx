"use client";

import { useCallback, useEffect, useState } from "react";
import { DemoLocalBanner } from "@/components/app/demo-local-banner";
import { EmptyState } from "@/components/empty-state";
import {
  clearDemoPortfolio,
  listDemoPortfolio,
  mergeDemoPortfolioImport,
  parsePortfolioCsv,
  removeDemoPortfolioRow,
  updateDemoPortfolioRow,
  type DemoPortfolioRow,
} from "@/lib/demo-data/portfolio";

const MAX_ROWS = 500;
const MAX_BYTES = 256_000;

export function PortfolioDemo({ demoId }: { demoId: string }) {
  const [rows, setRows] = useState<DemoPortfolioRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editCardId, setEditCardId] = useState("");
  const [editQty, setEditQty] = useState("1");

  const refresh = useCallback(() => {
    setRows(listDemoPortfolio(demoId));
  }, [demoId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function onFile(file: File | null) {
    if (!file) return;
    setMessage(null);
    if (file.size > MAX_BYTES) {
      setOk(false);
      setMessage("File is larger than 256 KB.");
      return;
    }
    const text = await file.text();
    const lines = text.trim().split(/\r?\n/);
    if (lines.length > MAX_ROWS) {
      setOk(false);
      setMessage(`Too many rows. Keep it to ${MAX_ROWS}.`);
      return;
    }
    const header = lines[0]?.toLowerCase();
    if (!header?.includes("card_id") || !header.includes("quantity")) {
      setOk(false);
      setMessage("The header row needs card_id and quantity columns.");
      return;
    }
    const parsed = parsePortfolioCsv(text);
    const { imported, merged } = mergeDemoPortfolioImport(demoId, parsed);
    setRows(merged);
    setOk(true);
    setMessage(`Imported ${imported} rows into your local demo portfolio.`);
  }

  function startEdit(row: DemoPortfolioRow) {
    setEditingCardId(row.cardId);
    setEditCardId(row.cardId);
    setEditQty(String(row.quantity));
  }

  function saveEdit() {
    if (!editingCardId) return;
    const qty = Number(editQty);
    if (!editCardId.trim() || !Number.isFinite(qty) || qty <= 0) return;
    setRows(
      updateDemoPortfolioRow(demoId, editingCardId, {
        cardId: editCardId.trim(),
        quantity: qty,
      }),
    );
    setEditingCardId(null);
  }

  function clearAll() {
    if (!rows.length) return;
    if (!window.confirm("Remove all demo portfolio rows from this browser?")) return;
    setRows(clearDemoPortfolio(demoId));
    setEditingCardId(null);
    setMessage(null);
  }

  return (
    <div>
      <DemoLocalBanner />
      <div className="card mt-6 p-5">
        <label className="field">
          CSV file
          <input type="file" accept=".csv,text/csv" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
          <span className="hint">Example header: card_id,quantity</span>
        </label>
        {message ? (
          <p className={`mt-3 text-sm ${ok ? "text-success" : "text-destructive"}`} role="status">
            {message}
          </p>
        ) : null}
      </div>
      {rows.length ? (
        <div className="mt-4 flex justify-end">
          <button type="button" className="btn btn-secondary text-sm" onClick={clearAll}>
            Clear all holdings
          </button>
        </div>
      ) : null}
      {!rows.length ? (
        <div className="mt-6">
          <EmptyState title="No holdings" body="Import a CSV to build a local demo portfolio." />
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {rows.map((row) => (
            <li key={row.cardId} className="flex flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              {editingCardId === row.cardId ? (
                <>
                  <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                    <input
                      className="rounded-lg border border-border px-2 py-1 text-xs"
                      value={editCardId}
                      onChange={(e) => setEditCardId(e.target.value)}
                      aria-label="Card id"
                    />
                    <input
                      type="number"
                      min="1"
                      className="w-24 rounded-lg border border-border px-2 py-1 text-xs"
                      value={editQty}
                      onChange={(e) => setEditQty(e.target.value)}
                      aria-label="Quantity"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" className="link text-xs" onClick={saveEdit}>Save</button>
                    <button type="button" className="link text-xs" onClick={() => setEditingCardId(null)}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <code className="text-xs">{row.cardId}</code>
                  <span className="font-medium">×{row.quantity}</span>
                  <div className="flex gap-3 sm:ml-auto">
                    <button type="button" className="link text-xs" onClick={() => startEdit(row)}>Edit</button>
                    <button
                      type="button"
                      className="link text-xs"
                      onClick={() => setRows(removeDemoPortfolioRow(demoId, row.cardId))}
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
