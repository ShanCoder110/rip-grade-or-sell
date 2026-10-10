"use client";

import { useCallback, useEffect, useState } from "react";
import { DemoLocalBanner } from "@/components/app/demo-local-banner";
import { EmptyState } from "@/components/empty-state";
import {
  addDemoAlert,
  listDemoAlerts,
  removeDemoAlert,
  type DemoAlertRule,
} from "@/lib/demo-data/alerts";

export function AlertsDemo({ demoId }: { demoId: string }) {
  const [rules, setRules] = useState<DemoAlertRule[]>([]);
  const [label, setLabel] = useState("");
  const [threshold, setThreshold] = useState("25");

  const refresh = useCallback(() => {
    setRules(listDemoAlerts(demoId));
  }, [demoId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    const thresholdCents = Math.round(Number(threshold) * 100);
    if (!label.trim() || !Number.isFinite(thresholdCents) || thresholdCents <= 0) return;
    setRules(addDemoAlert(demoId, { label, thresholdCents }));
    setLabel("");
  }

  return (
    <div>
      <DemoLocalBanner />
      <p className="mt-4 text-sm text-muted-foreground">
        Demo alerts are stored locally. Email delivery still requires Resend and Supabase in production.
      </p>
      <form onSubmit={onAdd} className="card mt-6 grid gap-3 p-5 sm:grid-cols-[1fr_8rem_auto] sm:items-end">
        <label className="field">
          Label
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Raw under $25" required />
        </label>
        <label className="field">
          Threshold (USD)
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="btn btn-primary">Add rule</button>
      </form>
      {!rules.length ? (
        <div className="mt-6">
          <EmptyState title="No alert rules" body="Add a rule to try local demo alerts." />
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {rules.map((rule) => (
            <li key={rule.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <span>
                {rule.label} · ${(rule.thresholdCents / 100).toFixed(2)}
              </span>
              <button
                type="button"
                className="link text-xs"
                onClick={() => setRules(removeDemoAlert(demoId, rule.id))}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
