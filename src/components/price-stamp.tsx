export function PriceStamp({ source, updatedAt }: { source: string; updatedAt: string }) {
  const label = updatedAt.includes("T")
    ? `${new Date(updatedAt).toISOString().slice(0, 16).replace("T", " ")} UTC`
    : `${updatedAt} UTC`;

  return (
    <p className="stamp">
      <span>Updated {label}</span>
      <span aria-hidden>·</span>
      <span>
        Source <code>{source}</code>
      </span>
    </p>
  );
}
