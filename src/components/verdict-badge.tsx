const copy = {
  rip: "Rip",
  hold: "Hold",
  skip: "Skip",
} as const;

export function VerdictBadge({ verdict }: { verdict: "rip" | "hold" | "skip" }) {
  return <span className={`verdict verdict-${verdict}`}>{copy[verdict]}</span>;
}
