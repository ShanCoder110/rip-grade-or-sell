import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/methodology", label: "Methodology" },
  { href: "/changelog", label: "Changelog" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refund", label: "Refund policy" },
  { href: "/affiliate-disclosure", label: "Affiliate disclosure" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-semibold text-foreground">Rip, Grade or Sell</p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            An independent tool for trading card collectors. Pokémon and related marks are
            trademarks of their respective owners. This site is not affiliated with or endorsed by
            The Pokémon Company, Nintendo, or Creatures.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap content-start gap-x-4 gap-y-2 text-sm">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Rip, Grade or Sell
      </p>
    </footer>
  );
}
