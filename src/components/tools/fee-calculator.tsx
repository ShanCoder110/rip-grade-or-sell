"use client";

import { useMemo, useState } from "react";
import { rankPlatforms } from "@/lib/engine/fees";
import { formatCents } from "@/lib/utils";

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
        <label className="text-sm">
          Sale price (¢)
          <input
            type="number"
            className="mt-1 w-full rounded border border-border px-2 py-1"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </label>
        <label className="text-sm">
          Shipping charged (¢)
          <input
            type="number"
            className="mt-1 w-full rounded border border-border px-2 py-1"
            value={shipping}
            onChange={(e) => setShipping(Number(e.target.value))}
          />
        </label>
      </div>
      <ol className="mt-8 space-y-4">
        {ranked.map((r, i) => (
          <li key={r.platform} className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium capitalize">
                #{i + 1} {r.platform}
              </span>
              <span className="text-lg font-semibold">{formatCents(r.netCents)} net</span>
            </div>
            <ul className="mt-2 text-sm text-muted-foreground">
              {r.lines.map((l) => (
                <li key={l.label}>
                  {l.label}: {formatCents(l.amountCents)}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs">
              Fees as of {r.effectiveFrom} ·{" "}
              <a href={r.sourceUrl} className="text-primary underline" rel="noopener noreferrer">
                source
              </a>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
