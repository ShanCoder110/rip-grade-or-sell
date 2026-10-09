"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { gradeOrSellAnalysis, type ConditionKey } from "@/lib/engine/grading";
import type { Platform } from "@/lib/engine/fees";
import { formatCents } from "@/lib/utils";

const PLATFORMS: Platform[] = ["tcgplayer", "ebay", "whatnot", "mercari", "paypal"];

function parseIntParam(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : fallback;
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

  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          Raw price (¢)
          <input
            type="number"
            className="mt-1 w-full rounded border border-border px-2 py-1"
            value={raw}
            onChange={(e) => setRaw(Number(e.target.value))}
          />
        </label>
        <label className="text-sm">
          PSA 9 price (¢)
          <input
            type="number"
            className="mt-1 w-full rounded border border-border px-2 py-1"
            value={psa9}
            onChange={(e) => setPsa9(Number(e.target.value))}
          />
        </label>
        <label className="text-sm">
          PSA 10 price (¢)
          <input
            type="number"
            className="mt-1 w-full rounded border border-border px-2 py-1"
            value={psa10}
            onChange={(e) => setPsa10(Number(e.target.value))}
          />
        </label>
        <label className="text-sm">
          Grading fee (¢)
          <input
            type="number"
            className="mt-1 w-full rounded border border-border px-2 py-1"
            value={fee}
            onChange={(e) => setFee(Number(e.target.value))}
          />
        </label>
        <label className="text-sm">
          Shipping + insurance (¢)
          <input
            type="number"
            className="mt-1 w-full rounded border border-border px-2 py-1"
            value={ship}
            onChange={(e) => setShip(Number(e.target.value))}
          />
        </label>
        <label className="text-sm">
          Platform
          <select
            className="mt-1 w-full rounded border border-border px-2 py-1"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="text-sm sm:col-span-2">
          Condition self-check
          <select
            className="mt-1 w-full rounded border border-border px-2 py-1"
            value={condition}
            onChange={(e) => setCondition(e.target.value as ConditionKey)}
          >
            <option value="mint">Mint</option>
            <option value="nm">Near Mint</option>
            <option value="lp">Lightly Played</option>
            <option value="mp">Moderately Played</option>
            <option value="hp">Heavily Played</option>
          </select>
        </label>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Expected net vs selling raw</p>
        <p className="text-2xl font-bold">
          {formatCents(analysis.expectedNetProfit)}{" "}
          <span className="text-base font-normal text-muted-foreground">expected advantage</span>
        </p>
        <ul className="mt-3 space-y-1 text-sm">
          <li>Raw net: {formatCents(analysis.sellRawNet)}</li>
          <li>Graded net (expected): {formatCents(analysis.expectedGradedNet)}</li>
          <li>Submission costs: {formatCents(analysis.totalCosts)}</li>
          <li>Break-even PSA 10 probability: {(analysis.breakEvenPsa10Prob * 100).toFixed(1)}%</li>
        </ul>
      </div>

      <button
        type="button"
        className="mt-4 rounded-md border border-border px-3 py-2 text-sm"
        onClick={() => navigator.clipboard.writeText(shareUrl)}
      >
        Copy share link
      </button>
    </div>
  );
}
