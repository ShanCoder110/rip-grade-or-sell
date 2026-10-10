"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatedCents } from "@/components/animated-cents";
import { MoneyInput } from "@/components/money-input";
import { gradeOrSellAnalysis, type ConditionKey } from "@/lib/engine/grading";
import type { Platform } from "@/lib/engine/fees";
import {
  centsParamToInitialInput,
  centsToShareParam,
  dollarInputToCents,
  formatDollarsHint,
} from "@/lib/money-input";

const PLATFORMS: Platform[] = ["tcgplayer", "ebay", "whatnot", "mercari", "paypal"];

const DEFAULTS = {
  raw: 2000,
  psa9: 3500,
  psa10: 8000,
  fee: 2500,
  ship: 500,
} as const;

export function GradeOrSellCalculator({ className }: { className?: string }) {
  const sp = useSearchParams();
  const [rawInput, setRawInput] = useState(() => centsParamToInitialInput(sp.get("raw")));
  const [psa9Input, setPsa9Input] = useState(() => centsParamToInitialInput(sp.get("psa9")));
  const [psa10Input, setPsa10Input] = useState(() => centsParamToInitialInput(sp.get("psa10")));
  const [feeInput, setFeeInput] = useState(() => centsParamToInitialInput(sp.get("fee")));
  const [shipInput, setShipInput] = useState(() => centsParamToInitialInput(sp.get("ship")));
  const [platform, setPlatform] = useState<Platform>(
    (sp.get("platform") as Platform) || "tcgplayer",
  );
  const [condition, setCondition] = useState<ConditionKey>(
    (sp.get("condition") as ConditionKey) || "nm",
  );
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const raw = dollarInputToCents(rawInput, DEFAULTS.raw);
  const psa9 = dollarInputToCents(psa9Input, DEFAULTS.psa9);
  const psa10 = dollarInputToCents(psa10Input, DEFAULTS.psa10);
  const fee = dollarInputToCents(feeInput, DEFAULTS.fee);
  const ship = dollarInputToCents(shipInput, DEFAULTS.ship);

  const analysis = useMemo(
    () =>
      gradeOrSellAnalysis({
        rawPriceCents: raw,
        psa9PriceCents: psa9,
        psa10PriceCents: psa10,
        gradingFeeCents: fee,
        shippingInsuranceCents: ship,
        platform,
        condition,
      }),
    [raw, psa9, psa10, fee, ship, platform, condition],
  );

  function buildShareUrl() {
    const q = new URLSearchParams({
      raw: centsToShareParam(raw),
      psa9: centsToShareParam(psa9),
      psa10: centsToShareParam(psa10),
      fee: centsToShareParam(fee),
      ship: centsToShareParam(ship),
      platform,
      condition,
    });
    return `${window.location.origin}/tools/grade-or-sell?${q}`;
  }

  async function copyLink() {
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(buildShareUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError("Could not copy. Select the address bar after opening the shared link.");
    }
  }

  const fields: {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    setValue: (v: string) => void;
    defaultCents: number;
  }[] = [
    {
      id: "raw-price",
      label: "Raw price (USD)",
      placeholder: "20",
      value: rawInput,
      setValue: setRawInput,
      defaultCents: DEFAULTS.raw,
    },
    {
      id: "psa9-price",
      label: "PSA 9 price (USD)",
      placeholder: "35",
      value: psa9Input,
      setValue: setPsa9Input,
      defaultCents: DEFAULTS.psa9,
    },
    {
      id: "psa10-price",
      label: "PSA 10 price (USD)",
      placeholder: "80",
      value: psa10Input,
      setValue: setPsa10Input,
      defaultCents: DEFAULTS.psa10,
    },
    {
      id: "grading-fee",
      label: "Grading fee (USD)",
      placeholder: "25",
      value: feeInput,
      setValue: setFeeInput,
      defaultCents: DEFAULTS.fee,
    },
    {
      id: "shipping",
      label: "Shipping and insurance (USD)",
      placeholder: "5",
      value: shipInput,
      setValue: setShipInput,
      defaultCents: DEFAULTS.ship,
    },
  ];

  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <MoneyInput
            key={field.id}
            id={field.id}
            label={field.label}
            placeholder={field.placeholder}
            value={field.value}
            onChange={field.setValue}
            hint={
              field.value.trim() === ""
                ? `Using ${formatDollarsHint(field.defaultCents)} until you enter a value`
                : `Calculated as ${formatDollarsHint(dollarInputToCents(field.value, field.defaultCents))}`
            }
          />
        ))}
        <label className="field">
          Sale platform
          <select value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <span className="hint">Fee schedule for this platform is applied to both paths.</span>
        </label>
        <label className="field sm:col-span-2">
          Condition self-check
          <select value={condition} onChange={(e) => setCondition(e.target.value as ConditionKey)}>
            <option value="mint">Mint</option>
            <option value="nm">Near Mint</option>
            <option value="lp">Lightly Played</option>
            <option value="mp">Moderately Played</option>
            <option value="hp">Heavily Played</option>
          </select>
          <span className="hint">Maps to sample grade odds, not an official gem rate.</span>
        </label>
      </div>

      <div className="card mt-8 p-5" aria-live="polite">
        <p className="text-sm text-muted-foreground">Expected net vs selling raw</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight">
          <AnimatedCents cents={analysis.expectedNetProfit} />
        </p>
        <p className="text-sm text-muted-foreground">expected advantage of grading</p>
        <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <li className="rounded-xl bg-muted px-3 py-2">
            Raw net <AnimatedCents cents={analysis.sellRawNet} className="float-right font-semibold" />
          </li>
          <li className="rounded-xl bg-muted px-3 py-2">
            Graded net{" "}
            <AnimatedCents cents={analysis.expectedGradedNet} className="float-right font-semibold" />
          </li>
          <li className="rounded-xl bg-muted px-3 py-2">
            Submission costs{" "}
            <AnimatedCents cents={analysis.totalCosts} className="float-right font-semibold" />
          </li>
          <li className="rounded-xl bg-muted px-3 py-2">
            Break-even PSA 10
            <span className="float-right font-semibold tabular-nums">
              {(analysis.breakEvenPsa10Prob * 100).toFixed(1)}%
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-secondary" onClick={copyLink}>
          {copied ? "Link copied" : "Copy share link"}
        </button>
        <p className="text-sm text-muted-foreground" role="status">
          {copied ? "Share URL is on your clipboard." : "URL keeps these inputs so you can send the result."}
        </p>
      </div>
      {copyError ? (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {copyError}
        </p>
      ) : null}
    </div>
  );
}
