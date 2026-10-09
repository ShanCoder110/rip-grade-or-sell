import Link from "next/link";

export const dynamic = "force-dynamic";

const links = [
  { href: "/app/watchlist", label: "Watchlist" },
  { href: "/app/portfolio", label: "Portfolio" },
  { href: "/app/alerts", label: "Alerts" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page">
      <nav aria-label="Account" className="mb-8 flex flex-wrap gap-2">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="btn btn-secondary">
            {item.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
