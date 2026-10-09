"use client";

import { useMemo, useState } from "react";
import { AnimatedCents } from "@/components/animated-cents";
import { rankPlatforms } from "@/lib/engine/fees";

export function FeeCalculator() {
  const [price, setPrice] = useState(5000);
  const [shipping, setShipping] = useState(499);

  const ranked = useMemo(
    () => rankPlatforms({ priceCents: price, shippingCents: shipping }),
    [price, shipping],
  );

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field">
          Sale price (cents)
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Math.max(0, Number(e.target.value) || 0))}
          />
          <span className="hint">Default $50.00. Change the cents to compare a different sale.</span>
        </label>
        <label className="field">
          Shipping charged to buyer (cents)
          <input
            type="number"
            min={0}
            value={shipping}
            onChange={(e) => setShipping(Math.max(0, Number(e.target.value) || 0))}
          />
          <span className="hint">Included in the fee base where the schedule says so.</span>
        </label>
      </div>
      <ol className="mt-8 space-y-3">
        {ranked.map((r, i) => (
          <li key={r.platform} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold capitalize">
                <span className="mr-2 text-xs text-muted-foreground">#{i + 1}</span>
                {r.platform}
              </span>
              <span className="text-lg font-semibold">
                <AnimatedCents cents={r.netCents} /> net
              </span>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {r.lines.map((l) => (
                <li key={l.label} className="flex justify-between gap-3">
                  <span>{l.label}</span>
                  <span className="tabular-nums text-foreground">
                    <AnimatedCents cents={l.amountCents} />
                  </span>
                </li>
              ))}
            </ul>
            <p className="stamp">
              <span>Fees as of {r.effectiveFrom}</span>
              <span aria-hidden>·</span>
              <a href={r.sourceUrl} className="link" rel="noopener noreferrer">
                source
              </a>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
