import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        <p className="mb-4 max-w-3xl leading-relaxed">
          Rip, Grade or Sell is an independent tool for trading card collectors. Pokémon and
          related marks are trademarks of their respective owners; this site is not affiliated
          with or endorsed by The Pokémon Company, Nintendo, or Creatures.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
          <Link href="/refund" className="hover:text-foreground">Refund policy</Link>
          <Link href="/affiliate-disclosure" className="hover:text-foreground">
            Affiliate disclosure
          </Link>
          <Link href="/changelog" className="hover:text-foreground">Changelog</Link>
        </div>
        <p className="mt-4 text-xs">© {new Date().getFullYear()} Rip, Grade or Sell</p>
      </div>
    </footer>
  );
}
