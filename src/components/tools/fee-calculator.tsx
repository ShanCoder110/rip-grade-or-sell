"use client";

import { useMemo, useState } from "react";
import { AnimatedCents } from "@/components/animated-cents";
import { MoneyInput } from "@/components/money-input";
import { rankPlatforms } from "@/lib/engine/fees";
import { dollarInputToCents, formatDollarsHint } from "@/lib/money-input";

const DEFAULT_PRICE_CENTS = 5000;
const DEFAULT_SHIPPING_CENTS = 499;

export function FeeCalculator() {
  const [priceInput, setPriceInput] = useState("");
  const [shippingInput, setShippingInput] = useState("");

  const price = dollarInputToCents(priceInput, DEFAULT_PRICE_CENTS);
  const shipping = dollarInputToCents(shippingInput, DEFAULT_SHIPPING_CENTS);

  const ranked = useMemo(
    () => rankPlatforms({ priceCents: price, shippingCents: shipping }),
    [price, shipping],
  );

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <MoneyInput
          id="sale-price"
          label="Sale price (USD)"
          placeholder="50"
          value={priceInput}
          onChange={setPriceInput}
          hint={
            priceInput.trim() === ""
              ? `Using ${formatDollarsHint(DEFAULT_PRICE_CENTS)} until you enter a value`
              : `Calculated as ${formatDollarsHint(price)}`
          }
        />
        <MoneyInput
          id="buyer-shipping"
          label="Shipping charged to buyer (USD)"
          placeholder="4.99"
          value={shippingInput}
          onChange={setShippingInput}
          hint={
            shippingInput.trim() === ""
              ? `Using ${formatDollarsHint(DEFAULT_SHIPPING_CENTS)} until you enter a value`
              : `Calculated as ${formatDollarsHint(shipping)}`
          }
        />
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
