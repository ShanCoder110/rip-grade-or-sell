import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  alternates: { canonical: "/" },
  description:
    "Decide whether to rip sealed TCG product, grade a card, or sell it—with net proceeds after fees.",
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Rip, grade, or sell—with numbers, not hype
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We combine published pull rates, recent market prices, marketplace fee rules, and grading
          costs to estimate expected value and net payout. Every figure cites its source and
          last-updated time.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/sets"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Browse sets
          </Link>
          <Link
            href="/tools/grade-or-sell"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium"
          >
            Grade or sell calculator
          </Link>
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Set EV",
            body: "Gross and net expected value for boxes, ETBs, and bundles with Rip / Hold / Skip verdicts.",
            href: "/sets",
          },
          {
            title: "Grade or sell",
            body: "Raw vs graded prices, PSA fee tiers, and break-even odds for submitting a card.",
            href: "/tools/grade-or-sell",
          },
          {
            title: "Fee calculator",
            body: "Itemized net payout across major marketplaces using versioned fee schedules.",
            href: "/tools/fee-calculator",
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-border bg-card p-5 shadow-sm transition hover:border-primary/40"
          >
            <h2 className="font-semibold">{card.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{card.body}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
