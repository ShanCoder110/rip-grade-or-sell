"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCents } from "@/lib/utils";

export type EvHistoryPoint = { date: string; netCents: number; grossCents: number };

export function EvHistoryChart({ data }: { data: EvHistoryPoint[] }) {
  if (!data.length) {
    return <p className="text-sm text-muted-foreground">No EV history yet.</p>;
  }
  return (
    <div className="h-64 w-full" aria-label="EV history chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={(v) => `$${(v / 100).toFixed(0)}`} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => formatCents(Number(v ?? 0))} />
          <Line type="monotone" dataKey="netCents" name="Net EV" stroke="#2563eb" dot={false} />
          <Line type="monotone" dataKey="grossCents" name="Gross EV" stroke="#94a3b8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
