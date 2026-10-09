"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyState } from "@/components/empty-state";
import { formatCents } from "@/lib/utils";

export type EvHistoryPoint = { date: string; netCents: number; grossCents: number };

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function EvHistoryChart({ data }: { data: EvHistoryPoint[] }) {
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
  const [colors, setColors] = useState({
    grid: "#d9d0c3",
    tick: "#5c5348",
    net: "#1b3a4b",
    gross: "#a16207",
    card: "#fffcf7",
    fg: "#1c1915",
  });

  useEffect(() => {
    const read = () => {
      const s = getComputedStyle(document.documentElement);
      setColors({
        grid: s.getPropertyValue("--border").trim() || "#d9d0c3",
        tick: s.getPropertyValue("--muted-foreground").trim() || "#5c5348",
        net: s.getPropertyValue("--chart-net").trim() || "#1b3a4b",
        gross: s.getPropertyValue("--chart-gross").trim() || "#a16207",
        card: s.getPropertyValue("--card").trim() || "#fffcf7",
        fg: s.getPropertyValue("--foreground").trim() || "#1c1915",
      });
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const peak = data.reduce((max, point) => Math.max(max, point.netCents, point.grossCents), 0);

  if (!data.length) {
    return (
      <EmptyState
        title="No EV history yet"
        body="History appears after at least one price snapshot is captured for this product."
      />
    );
  }

  return (
    <div className="card w-full p-3 sm:p-4" aria-label="EV history chart">
      <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={colors.grid} strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: colors.tick }} axisLine={false} tickLine={false} />
          <YAxis
            domain={[0, Math.max(100, Math.ceil(peak * 1.2))]}
            tickFormatter={(v) => `$${(Number(v) / 100).toFixed(0)}`}
            tick={{ fontSize: 11, fill: colors.tick }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            formatter={(v) => formatCents(Number(v ?? 0))}
            contentStyle={{
              background: colors.card,
              border: `1px solid ${colors.grid}`,
              borderRadius: 12,
              color: colors.fg,
              fontSize: 13,
            }}
          />
          <Line
            type="monotone"
            dataKey="netCents"
            name="Net EV"
            stroke={colors.net}
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={!reduced}
          />
          <Line
            type="monotone"
            dataKey="grossCents"
            name="Gross EV"
            stroke={colors.gross}
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 4"
            isAnimationActive={!reduced}
          />
        </LineChart>
      </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Solid line is net EV. Dashed line is gross EV.</p>
    </div>
  );
}
