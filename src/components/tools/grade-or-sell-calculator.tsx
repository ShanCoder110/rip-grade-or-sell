"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatedCents } from "@/components/animated-cents";
import { gradeOrSellAnalysis, type ConditionKey } from "@/lib/engine/grading";
import type { Platform } from "@/lib/engine/fees";

const PLATFORMS: Platform[] = ["tcgplayer", "ebay", "whatnot", "mercari", "paypal"];

function parseIntParam(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : fallback;
}

function dollars(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function GradeOrSellCalculator({ className }: { className?: string }) {
  const sp = useSearchParams();
  const [raw, setRaw] = useState(parseIntParam(sp.get("raw"), 2000));
  const [psa9, setPsa9] = useState(parseIntParam(sp.get("psa9"), 3500));
  const [psa10, setPsa10] = useState(parseIntParam(sp.get("psa10"), 8000));
  const [fee, setFee] = useState(parseIntParam(sp.get("fee"), 2500));
  const [ship, setShip] = useState(parseIntParam(sp.get("ship"), 500));
  const [platform, setPlatform] = useState<Platform>(
    (sp.get("platform") as Platform) || "tcgplayer",
  );
  const [condition, setCondition] = useState<ConditionKey>(
    (sp.get("condition") as ConditionKey) || "nm",
  );
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

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
      raw: String(raw),
      psa9: String(psa9),
      psa10: String(psa10),
      fee: String(fee),
      ship: String(ship),
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

  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            ["Raw price (cents)", raw, setRaw],
            ["PSA 9 price (cents)", psa9, setPsa9],
            ["PSA 10 price (cents)", psa10, setPsa10],
            ["Grading fee (cents)", fee, setFee],
            ["Shipping and insurance (cents)", ship, setShip],
          ] as const
        ).map(([label, value, setter]) => (
          <label key={label} className="field">
            {label}
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={value}
              onChange={(e) => setter(Math.max(0, Number(e.target.value) || 0))}
            />
            <span className="hint">{dollars(value)} · stored as integer cents</span>
          </label>
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
