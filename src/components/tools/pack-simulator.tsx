"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { AnimatedCents } from "@/components/animated-cents";
import { EmptyState } from "@/components/empty-state";
import { SEED_CARDS, SEED_PULL_RATES } from "@/lib/data/seed-fallback";
import { simulatePack } from "@/lib/engine/pack-sim";

const SAMPLE_PRICES = new Map<string, number>(
  SEED_CARDS.map((c) => [c.rarity, c.rarity === "Illustration Rare" ? 1200 : 375]),
);

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function PackSimulator() {
  const reduced = useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [phase, setPhase] = useState<"idle" | "rip" | "reveal">("idle");
  const [last, setLast] = useState<{ rarity: string; valueCents: number } | null>(null);

  const rates = useMemo(
    () => SEED_PULL_RATES.map((r) => ({ rarity: r.rarity, odds: r.odds })),
    [],
  );
  const source = SEED_PULL_RATES[0];

  function openPack() {
    if (phase === "rip") return;
    setPhase("rip");
    window.setTimeout(() => {
      const result = simulatePack(rates, SAMPLE_PRICES);
      const slot = result.slots[0];
      setCount((c) => c + 1);
      setTotal((t) => t + result.totalCents);
      setLast(slot ? { rarity: slot.rarity, valueCents: slot.valueCents } : null);
      setPhase("reveal");
    }, reduced ? 0 : 680);
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Sample pull rates only. Source{" "}
        <a className="link" href={source?.source_url} rel="noopener noreferrer">
          {source?.confidence ?? "sample"}
        </a>{" "}
        as of {source?.source_date}. Prices are labeled sample data, not live comps.
      </p>
      <button type="button" className="btn btn-primary mt-4" onClick={openPack} disabled={phase === "rip"}>
        {phase === "rip" ? "Opening…" : "Open virtual pack"}
      </button>

      <div className="mt-6 grid gap-4 sm:grid-cols-[180px_1fr]">
        <div
          className={`grid h-44 place-items-center rounded-2xl border border-border bg-primary text-primary-foreground ${phase === "rip" ? "pack-rip" : ""}`}
          aria-hidden
        >
          <span className="text-sm font-semibold tracking-wide">SEALED</span>
        </div>
        <div>
          {phase === "idle" || !last ? (
            <EmptyState
              title="No packs opened yet"
              body="Open a pack to reveal one hit from the sample odds and add it to the running total."
            />
          ) : (
            <div className={`card card-in p-5 ${phase === "reveal" ? "" : ""}`} key={`${count}-${last.rarity}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">Last hit</p>
              <p className="mt-2 text-2xl font-semibold">{last.rarity}</p>
              <p className="mt-1 text-muted-foreground">
                Sample value <AnimatedCents cents={last.valueCents} className="font-semibold text-foreground" />
              </p>
            </div>
          )}
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3">
        <div className="card p-4">
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">Packs opened</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">{count}</dd>
        </div>
        <div className="card p-4">
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">Running value</dt>
          <dd className="mt-1 text-2xl font-semibold">
            <AnimatedCents cents={total} />
          </dd>
        </div>
      </dl>
    </div>
  );
}
