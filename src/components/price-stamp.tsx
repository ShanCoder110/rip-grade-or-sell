export function PriceStamp({ source, updatedAt }: { source: string; updatedAt: string }) {
  const time = updatedAt.includes("T")
    ? new Date(updatedAt).toISOString().slice(11, 16)
    : updatedAt;
  return (
    <p className="text-xs text-muted-foreground">
      Prices updated {time} UTC · Source: <span className="font-mono">{source}</span>
    </p>
  );
}
