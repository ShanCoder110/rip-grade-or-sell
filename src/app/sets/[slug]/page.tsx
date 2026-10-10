import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EvHistoryChart, type EvHistoryPoint } from "@/components/ev-history-chart";
import { PriceStamp } from "@/components/price-stamp";
import { AdSlot } from "@/components/ads/ad-slot";
import { adSlots } from "@/lib/ads/slots";
import { SEED_PRERELEASE_EXPECTED_RARITIES } from "@/lib/data/seed-fallback";
import { getAdjacentSets } from "@/lib/data/set-navigation";
import {
  generateSetSlugParams,
} from "@/lib/data/set-static-params";
import { getSetBySlug } from "@/lib/data/sets";
import {
  pullRateDisclaimer,
  resolvePullRatesForProduct,
} from "@/lib/engine/pull-rates";
import {
  computeProductEv,
  latestCardPrices,
  latestProductPrice,
} from "@/lib/engine/set-ev";
import { AnimatedCents } from "@/components/animated-cents";
import { EmailCapture } from "@/components/email-capture";
import { EmptyState } from "@/components/empty-state";
import { VerdictBadge } from "@/components/verdict-badge";
import { formatCents } from "@/lib/utils";

export const revalidate = 86400;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return generateSetSlugParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const set = await getSetBySlug(slug);
  if (!set) notFound();
  return {
    title: set.name,
    alternates: { canonical: `/sets/${slug}` },
    description: `Pull rates, chase cards, and sealed EV for ${set.name}.`,
  };
}

function buildEvHistory(
  snapshots: {
    captured_on: string;
    price_cents: number;
    card_id: string | null;
    source: string;
  }[],
  pullRates: { rarity: string; odds: number }[],
  cards: { id: string; rarity: string }[],
  packCount: number,
  sealedCents: number,
): EvHistoryPoint[] {
  const dates = [...new Set(snapshots.map((s) => s.captured_on))].sort();

  return dates.map((date) => {
    const daySnaps = snapshots.filter((s) => s.captured_on === date);
    const prices = latestCardPrices(daySnaps, cards);
    const ev = computeProductEv(pullRates, prices, packCount, sealedCents);
    return { date, grossCents: ev.gross, netCents: ev.net.netCents };
  });
}

export default async function SetDetailPage({ params }: Props) {
  const { slug } = await params;
  const set = await getSetBySlug(slug);
  if (!set) notFound();

  const { prev, next } = await getAdjacentSets(slug);
  const primaryProduct = set.products[0];
  const pricesByRarity = latestCardPrices(set.price_snapshots, set.cards);
  const latestSource =
    set.price_snapshots[0]?.source ?? "seed_sample";
  const latestDate =
    set.price_snapshots.reduce(
      (max, s) => (s.captured_on > max ? s.captured_on : max),
      "1970-01-01",
    ) + "T12:00:00Z";

  const primaryPullRates =
    primaryProduct
      ? resolvePullRatesForProduct(set.pull_rates, primaryProduct.id, set.products)
      : null;

  const ev =
    primaryProduct && primaryPullRates?.rates.length
      ? computeProductEv(
          primaryPullRates.rates,
          pricesByRarity,
          primaryProduct.pack_count,
          latestProductPrice(set.price_snapshots, primaryProduct.id) ??
            primaryProduct.msrp_cents,
        )
      : null;

  const history =
    primaryProduct && primaryPullRates?.rates.length
      ? buildEvHistory(
          set.price_snapshots,
          primaryPullRates.rates,
          set.cards,
          primaryProduct.pack_count,
          latestProductPrice(set.price_snapshots, primaryProduct.id) ??
            primaryProduct.msrp_cents,
        )
      : [];

  const chaseCards = [...set.cards]
    .map((card) => {
      const snap = set.price_snapshots
        .filter((s) => s.card_id === card.id)
        .sort((a, b) => b.captured_on.localeCompare(a.captured_on))[0];
      return { card, price: snap?.price_cents ?? null, source: snap?.source ?? "—" };
    })
    .sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

  const prereleaseNotes = SEED_PRERELEASE_EXPECTED_RARITIES.filter(
    (r) => r.set_id === set.id,
  );

  return (
    <div className="page">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/sets", label: "Sets" },
          { href: `/sets/${slug}`, label: set.name },
        ]}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="rise">
          <h1 className="h1">{set.name}</h1>
          <PriceStamp source={latestSource} updatedAt={latestDate} />
        </div>
        {ev ? (
          <div className="card rise delay-1 min-w-56 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Verdict
            </p>
            <div className="mt-2">
              <VerdictBadge verdict={ev.verdict} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Net <AnimatedCents cents={ev.net.netCents} className="font-semibold text-foreground" />
              <span className="mx-1">·</span>
              Gross <AnimatedCents cents={ev.gross} className="font-semibold text-foreground" />
            </p>
          </div>
        ) : null}
      </div>

      {set.is_prerelease ? (
        <section className="card mt-8 border-dashed p-6">
          <h2 className="h2">Pre-release template</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The official card list and measured pull rates replace this section when they are
            published. Expected rarities below are unverified placeholders.
          </p>
          {prereleaseNotes.length ? (
            <ul className="mt-4 grid gap-2 sm:grid-cols-3">
              {prereleaseNotes.map((r) => (
                <li key={r.rarity} className="rounded-xl bg-muted px-3 py-2 text-sm">
                  <span className="font-medium">{r.rarity}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{r.note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4">
              <EmptyState title="No expected rarities" body="The pre-release list has not been added yet." />
            </div>
          )}
        </section>
      ) : null}

      {set.pull_rates.length ? (
        <section className="mt-10 min-w-0">
          <h2 className="h2">Pull rates</h2>
          {primaryProduct && primaryPullRates?.scope === "fallback" ? (
            <p className="mt-2 text-sm text-muted-foreground" role="note">
              {pullRateDisclaimer(primaryPullRates, primaryProduct.name)}
            </p>
          ) : null}
          <div className="table-wrap mt-3 max-w-full">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rarity</th>
                  <th>Odds</th>
                  <th>Source</th>
                  <th>As of</th>
                </tr>
              </thead>
              <tbody>
                {set.pull_rates.map((r) => (
                  <tr key={r.rarity}>
                    <td>{r.rarity}</td>
                    <td>1 in {r.odds}</td>
                    <td>
                      <a href={r.source_url} className="link" rel="noopener noreferrer">
                        {r.confidence}
                      </a>
                    </td>
                    <td>{r.source_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {chaseCards.length ? (
        <section className="mt-10 min-w-0">
          <h2 className="h2">Chase cards</h2>
          <div className="table-wrap mt-3 max-w-full">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Card</th>
                  <th>Rarity</th>
                  <th>Price</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {chaseCards.map(({ card, price, source }) => (
                  <tr key={card.id}>
                    <td>
                      <Link href={`/sets/${slug}/cards/${card.id}/grade`} className="link">
                        {card.name}
                      </Link>
                    </td>
                    <td>{card.rarity}</td>
                    <td>{price != null ? formatCents(price) : "—"}</td>
                    <td>
                      <code className="text-xs">{source}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : !set.is_prerelease ? (
        <div className="mt-10">
          <EmptyState title="No chase cards" body="Cards show up here once the set checklist is loaded." />
        </div>
      ) : null}

      {set.products.length ? (
        <section className="mt-10">
          <h2 className="h2">Products</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {set.products.map((p) => (
              <li key={p.id}>
                <Link href={`/sets/${slug}/${p.slug}-ev`} className="card block p-4 transition hover:-translate-y-0.5">
                  <span className="font-medium">{p.name}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    MSRP {formatCents(p.msrp_cents)} · {p.pack_count} packs
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="h2">EV history</h2>
        <div className="mt-3">
          <EvHistoryChart data={history} />
        </div>
        <AdSlot slot={adSlots.setBelowChart} format="horizontal" className="mt-6" />
      </section>

      <div className="mt-10 flex flex-col gap-3 text-sm sm:flex-row sm:justify-between">
        {prev ? (
          <Link href={`/sets/${prev.slug}`} className="btn btn-secondary">
            ← {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/sets/${next.slug}`} className="btn btn-secondary">
            {next.name} →
          </Link>
        ) : null}
      </div>

      <EmailCapture source={`set:${slug}`} />

      <p className="mt-8 text-sm">
        <Link href="/tools/fee-calculator" className="link">
          Compare marketplace fees
        </Link>
        <span className="mx-2 text-muted-foreground">·</span>
        <Link href="/tools/grade-or-sell" className="link">
          Grade or sell calculator
        </Link>
      </p>
    </div>
  );
}
