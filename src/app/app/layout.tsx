import Link from "next/link";

export const dynamic = "force-dynamic";

const links = [
  { href: "/app/watchlist", label: "Watchlist" },
  { href: "/app/portfolio", label: "Portfolio" },
  { href: "/app/alerts", label: "Alerts" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page min-w-0 max-w-full overflow-x-clip">
      <nav aria-label="Account" className="mb-8 flex w-full min-w-0 max-w-full flex-wrap gap-2">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="btn btn-secondary shrink-0">
            {item.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
