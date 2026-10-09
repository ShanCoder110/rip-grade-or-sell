"use client";

import { useState } from "react";

const MAX_ROWS = 500;
const MAX_BYTES = 256_000;

export function PortfolioCsvImport({ className }: { className?: string }) {
  const [result, setResult] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onFile(file: File | null) {
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setOk(false);
      setResult("File is larger than 256 KB.");
      return;
    }
    const text = await file.text();
    const rows = text.trim().split(/\r?\n/);
    if (rows.length > MAX_ROWS) {
      setOk(false);
      setResult(`Too many rows. Keep it to ${MAX_ROWS}.`);
      return;
    }
    const header = rows[0]?.toLowerCase();
    if (!header?.includes("card_id") || !header.includes("quantity")) {
      setOk(false);
      setResult("The header row needs card_id and quantity columns.");
      return;
    }
    const res = await fetch("/api/portfolio/import", {
      method: "POST",
      headers: { "Content-Type": "text/csv" },
      body: text,
    });
    const data = await res.json();
    setOk(res.ok);
    setResult(data.message ?? data.error ?? (res.ok ? "Imported." : "Import failed."));
  }

  return (
    <div className={`card p-5 ${className ?? ""}`}>
      <label className="field">
        CSV file
        <input type="file" accept=".csv,text/csv" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
        <span className="hint">Example header: card_id,quantity</span>
      </label>
      {result ? (
        <p className={`mt-3 text-sm ${ok ? "text-success" : "text-destructive"}`} role="status">
          {result}
        </p>
      ) : null}
    </div>
  );
}
