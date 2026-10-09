import Link from "next/link";

export function ProGate({ feature }: { feature: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
      <p className="font-medium">{feature} is a Pro feature</p>
      <p className="mt-1 text-muted-foreground">
        Upgrade for unlimited watchlist, full EV history, alerts, and portfolio tools.
      </p>
      <Link href="/pricing" className="mt-3 inline-block text-primary underline">
        View pricing
      </Link>
    </div>
  );
}
