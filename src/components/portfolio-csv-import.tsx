"use client";

import { useState } from "react";

const MAX_ROWS = 500;
const MAX_BYTES = 256_000;

export function PortfolioCsvImport({ className }: { className?: string }) {
  const [result, setResult] = useState<string | null>(null);

  async function onFile(file: File | null) {
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setResult("File too large (max 256KB).");
      return;
    }
    const text = await file.text();
    const rows = text.trim().split(/\r?\n/);
    if (rows.length > MAX_ROWS) {
      setResult(`Too many rows (max ${MAX_ROWS}).`);
      return;
    }
    const header = rows[0]?.toLowerCase();
    if (!header?.includes("card_id") || !header.includes("quantity")) {
      setResult("CSV must include card_id and quantity columns.");
      return;
    }
    const res = await fetch("/api/portfolio/import", {
      method: "POST",
      headers: { "Content-Type": "text/csv" },
      body: text,
    });
    const data = await res.json();
    setResult(data.message ?? (res.ok ? "Imported." : "Import failed."));
  }

  return (
    <div className={className}>
      <input
        type="file"
        accept=".csv,text/csv"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        className="text-sm"
      />
      {result ? <p className="mt-2 text-sm">{result}</p> : null}
    </div>
  );
}
