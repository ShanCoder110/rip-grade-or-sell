import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-narrow text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">404</p>
      <h1 className="h1 mt-3">That page is not in the binder</h1>
      <p className="lede mx-auto">The set, card, or tool you asked for is missing or has no published data yet.</p>
      <Link href="/sets" className="btn btn-primary mt-6">
        Browse sets
      </Link>
    </div>
  );
}
