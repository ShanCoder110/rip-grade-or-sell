import Link from "next/link";
import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/ad-slot";
import { AnimatedCents } from "@/components/animated-cents";
import { PriceStamp } from "@/components/price-stamp";
import { VerdictBadge } from "@/components/verdict-badge";
import { adSlots } from "@/lib/ads/slots";
import {
  SEED_CARDS,
  SEED_PRICE_SNAPSHOTS,
  SEED_PRODUCTS,
  SEED_PULL_RATES,
} from "@/lib/data/seed-fallback";
import { computeProductEv, latestCardPrices, latestProductPrice } from "@/lib/engine/set-ev";

export const metadata: Metadata = {
  title: "Home",
  alternates: { canonical: "/" },
  description:
    "Free tool for trading card collectors. See whether to rip sealed product, grade a card, or sell it, with net profit after fees.",
};

const tools = [
  {
    title: "Rip or keep sealed",
    body: "Expected value of a box, ETB, or bundle after pull rates, prices, and selling fees. You get a Rip, Hold, or Skip verdict.",
    href: "/sets",
    cta: "Browse set EV",
  },
  {
    title: "Grade or sell",
    body: "Compare selling a card raw with the expected payout if you submit it, including grading fees and the PSA 10 rate you need to break even.",
    href: "/tools/grade-or-sell",
    cta: "Open the calculator",
  },
  {
    title: "Sell and keep more",
    body: "Net payout for one sale across marketplaces, with every fee line shown and a source link on the schedule.",
    href: "/tools/fee-calculator",
    cta: "Compare fees",
  },
];

export default function HomePage() {
  const product = SEED_PRODUCTS[0]!;
  const cards = SEED_CARDS.filter((card) => card.set_id === product.set_id);
  const rates = SEED_PULL_RATES.filter((rate) => rate.product_id === product.id);
  const snaps = SEED_PRICE_SNAPSHOTS.filter(
    (snap) => snap.product_id === product.id || cards.some((card) => card.id === snap.card_id),
  );
  const prices = latestCardPrices(snaps, cards);
  const sealed = latestProductPrice(snaps, product.id) ?? product.msrp_cents;
  const ev = computeProductEv(rates, prices, product.pack_count, sealed);
  const source = snaps.find((snap) => snap.product_id === product.id)?.source ?? "seed_sample";
  const updated =
    snaps.reduce((max, snap) => (snap.captured_on > max ? snap.captured_on : max), "1970-01-01") +
    "T12:00:00Z";

  return (
    <div className="page">
      <section className="rise max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Free tool for trading card collectors
        </p>
        <h1 className="h1 mt-3">Rip, grade, or sell — and see the net after fees</h1>
        <p className="lede">
          Rip, Grade or Sell tells you whether opening sealed product, grading a card, or selling it
          raw leaves you ahead. The math uses published pull rates, recent prices, marketplace
          fees, shipping, and grading costs. Every calculator, watchlist, alerts, and portfolio
          feature is free. Sign in only when you want to save data to your account.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/sets" className="btn btn-primary">
            Check a sealed product
          </Link>
          <Link href="/tools/grade-or-sell" className="btn btn-secondary">
            Grade or sell calculator
          </Link>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="h2">
          Three ways to decide
        </h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {tools.map((tool) => (
            <article key={tool.href} className="card flex flex-col p-5">
              <h3 className="text-lg font-semibold">{tool.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{tool.body}</p>
              <Link href={tool.href} className="btn btn-primary mt-5 self-start">
                {tool.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <AdSlot slot={adSlots.homeBetweenTools} format="rectangle" className="mt-14" />

      <section className="mt-14" aria-labelledby="how-heading">
        <h2 id="how-heading" className="h2">
          How it works
        </h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            "We load pull rates and price snapshots. Every figure shows its source and the time it was updated.",
            "Pure functions turn those inputs into integer cents: gross EV, fees, shipping, and grading cost.",
            "You get a Rip, Hold, or Skip call for sealed product, or a grade-versus-sell result for a single.",
          ].map((step, index) => (
            <li key={step} className="card p-5 text-sm leading-relaxed">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                Step {index + 1}
              </span>
              <p className="mt-2">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14" aria-labelledby="example-heading">
        <h2 id="example-heading" className="h2">
          Example from sample data
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          This is the seeded demo set, not a live market quote. It shows the same verdict the set
          page uses.
        </p>
        <div className="card mt-4 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <VerdictBadge verdict={ev.verdict} />
          </div>
          <PriceStamp source={source} updatedAt={updated} />
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Sealed price</dt>
              <dd className="text-xl font-semibold">
                <AnimatedCents cents={sealed} />
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Gross EV</dt>
              <dd className="text-xl font-semibold">
                <AnimatedCents cents={ev.gross} />
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Net after fees</dt>
              <dd className="text-xl font-semibold">
                <AnimatedCents cents={ev.net.netCents} />
              </dd>
            </div>
          </dl>
          <Link href="/sets/sample-stellar-crown" className="btn btn-secondary mt-5">
            Open the sample set
          </Link>
        </div>
      </section>

      <section className="card mt-14 p-6 sm:p-8" aria-labelledby="support-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">How we fund the site</p>
        <h2 id="support-heading" className="h2 mt-2">
          Free for collectors, supported by ads
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          There are no subscriptions or in-app purchases. We may show Google AdSense ads on some
          pages after you accept optional cookies in the banner. Affiliate links on marketplace
          comparisons are disclosed separately.
        </p>
        <Link href="/privacy" className="btn btn-secondary mt-5">
          Privacy &amp; cookies
        </Link>
      </section>
    </div>
  );
}
