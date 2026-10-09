import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 flex gap-4 text-sm">
        <Link href="/app/watchlist">Watchlist</Link>
        <Link href="/app/portfolio">Portfolio</Link>
        <Link href="/app/alerts">Alerts</Link>
      </nav>
      {children}
    </div>
  );
}
