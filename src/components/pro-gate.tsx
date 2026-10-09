import Link from "next/link";

export function ProGate({ feature }: { feature: string }) {
  return (
    <div className="card mt-4 p-5">
      <p className="font-semibold">{feature} is a Pro feature</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Pro unlocks an unlimited watchlist, full history, alerts, and portfolio tools. Cancel
        anytime.
      </p>
      <Link href="/pricing" className="btn btn-primary mt-4">
        View pricing
      </Link>
    </div>
  );
}
