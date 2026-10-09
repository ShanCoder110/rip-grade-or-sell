import Link from "next/link";

const nav = [
  { href: "/sets", label: "Sets" },
  { href: "/tools/grade-or-sell", label: "Grade or Sell" },
  { href: "/tools/fee-calculator", label: "Fee Calculator" },
  { href: "/tools/pack-simulator", label: "Pack Simulator" },
  { href: "/pricing", label: "Pricing" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight text-foreground">
          Rip, Grade or Sell
        </Link>
        <nav className="hidden flex-wrap items-center gap-x-4 gap-y-1 text-sm md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/auth/login"
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}
