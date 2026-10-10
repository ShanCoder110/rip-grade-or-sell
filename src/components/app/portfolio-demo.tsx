"use client";

import { useCallback, useEffect, useState } from "react";
import { DemoLocalBanner } from "@/components/app/demo-local-banner";
import { EmptyState } from "@/components/empty-state";
import {
  listDemoPortfolio,
  mergeDemoPortfolioImport,
  parsePortfolioCsv,
  type DemoPortfolioRow,
} from "@/lib/demo-data/portfolio";

const MAX_ROWS = 500;
const MAX_BYTES = 256_000;

export function PortfolioDemo({ demoId }: { demoId: string }) {
  const [rows, setRows] = useState<DemoPortfolioRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

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
      {!rows.length ? (
        <div className="mt-6">
          <EmptyState title="No holdings" body="Import a CSV to build a local demo portfolio." />
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {rows.map((row) => (
            <li key={row.cardId} className="flex justify-between px-4 py-3 text-sm">
              <code className="text-xs">{row.cardId}</code>
              <span className="font-medium">×{row.quantity}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
