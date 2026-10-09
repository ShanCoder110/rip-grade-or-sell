"use client";

import { useMemo, useState } from "react";
import { SEED_CARDS, SEED_PULL_RATES } from "@/lib/data/seed-fallback";
import { simulatePack } from "@/lib/engine/pack-sim";
import { formatCents } from "@/lib/utils";

const SAMPLE_PRICES = new Map<string, number>(
  SEED_CARDS.map((c) => [c.rarity, c.rarity === "Illustration Rare" ? 1200 : 375]),
);

export function PackSimulator() {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [last, setLast] = useState<string>("");

  const rates = useMemo(
    () => SEED_PULL_RATES.map((r) => ({ rarity: r.rarity, odds: r.odds })),
    [],
  );

  function openPack() {
    const result = simulatePack(rates, SAMPLE_PRICES);
    setCount((c) => c + 1);
    setTotal((t) => t + result.totalCents);
    setLast(result.slots.map((s) => s.rarity).join(", "));
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Uses published sample pull rates for the demo set. Values are sample prices only.
      </p>
      <button
        type="button"
        onClick={openPack}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Open virtual pack
      </button>
      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-muted-foreground">Packs opened</dt>
          <dd className="text-xl font-semibold">{count}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Running value</dt>
          <dd className="text-xl font-semibold">{formatCents(total)}</dd>
        </div>
      </dl>
      {last ? <p className="mt-2 text-sm">Last pack: {last}</p> : null}
    </div>
  );
}
