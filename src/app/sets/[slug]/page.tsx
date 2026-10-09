import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EvHistoryChart, type EvHistoryPoint } from "@/components/ev-history-chart";
import { PriceStamp } from "@/components/price-stamp";
import { getUserPlan } from "@/lib/auth/entitlements";
import { filterHistoryByPlan } from "@/lib/auth/plan-limits";
import { SEED_PRERELEASE_EXPECTED_RARITIES } from "@/lib/data/seed-fallback";
import { getAdjacentSets } from "@/lib/data/set-navigation";
import { getAllSetSlugs, getSetBySlug } from "@/lib/data/sets";
import {
  computeProductEv,
  latestCardPrices,
  latestProductPrice,
} from "@/lib/engine/set-ev";
import { EmailCapture } from "@/components/email-capture";
import { formatCents } from "@/lib/utils";

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllSetSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const set = await getSetBySlug(slug);
  if (!set) return { title: "Set not found" };
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
  plan: Awaited<ReturnType<typeof getUserPlan>>,
): EvHistoryPoint[] {
  const dates = [...new Set(snapshots.map((s) => s.captured_on))].sort();
  const filteredDates = filterHistoryByPlan(
    dates.map((d) => ({ captured_on: d })),
    plan,
  ).map((d) => d.captured_on);

  return filteredDates.map((date) => {
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

  const plan = await getUserPlan();
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

  const ev =
    primaryProduct && set.pull_rates.length
      ? computeProductEv(
          set.pull_rates,
          pricesByRarity,
          primaryProduct.pack_count,
          latestProductPrice(set.price_snapshots, primaryProduct.id) ??
            primaryProduct.msrp_cents,
        )
      : null;

  const history =
    primaryProduct && set.pull_rates.length
      ? buildEvHistory(
          set.price_snapshots,
          set.pull_rates,
          set.cards,
          primaryProduct.pack_count,
          latestProductPrice(set.price_snapshots, primaryProduct.id) ??
            primaryProduct.msrp_cents,
          plan,
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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs
        items={[{ href: "/sets", label: "Sets" }, { href: `/sets/${slug}`, label: set.name }]}
      />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{set.name}</h1>
          <PriceStamp source={latestSource} updatedAt={latestDate} />
        </div>
        {ev ? (
          <div className="rounded-lg border border-border bg-card px-4 py-3 text-center">
            <p className="text-xs uppercase text-muted-foreground">Verdict</p>
            <p className="text-2xl font-bold capitalize">{ev.verdict}</p>
            <p className="text-sm text-muted-foreground">
              Net EV {formatCents(ev.net.netCents)} · Gross {formatCents(ev.gross)}
            </p>
          </div>
        ) : null}
      </div>

      {set.is_prerelease ? (
        <section className="mt-8 rounded-lg border border-dashed border-border p-6">
          <h2 className="text-lg font-semibold">Pre-release template</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Official card list and measured pull rates will replace this section when data is
            published. Expected rarities (unverified placeholders):
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm">
            {prereleaseNotes.map((r) => (
              <li key={r.rarity}>{r.rarity} — {r.note}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {set.pull_rates.length ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Pull rates</h2>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2">Rarity</th>
                <th>Odds (1 in N packs)</th>
                <th>Source</th>
                <th>As of</th>
              </tr>
            </thead>
            <tbody>
              {set.pull_rates.map((r) => (
                <tr key={r.rarity} className="border-b border-border/60">
                  <td className="py-2">{r.rarity}</td>
                  <td>{r.odds}</td>
                  <td>
                    <a href={r.source_url} className="text-primary underline" rel="noopener">
                      link
                    </a>
                  </td>
                  <td>{r.source_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {chaseCards.length ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Chase cards</h2>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2">Card</th>
                <th>Rarity</th>
                <th>Price</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {chaseCards.map(({ card, price, source }) => (
                <tr key={card.id} className="border-b border-border/60">
                  <td className="py-2">
                    <Link
                      href={`/sets/${slug}/cards/${card.id}/grade`}
                      className="text-primary hover:underline"
                    >
                      {card.name}
                    </Link>
                  </td>
                  <td>{card.rarity}</td>
                  <td>{price != null ? formatCents(price) : "—"}</td>
                  <td className="font-mono text-xs">{source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {set.products.length ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Products</h2>
          <ul className="mt-3 space-y-2">
            {set.products.map((p) => (
              <li key={p.id}>
                <Link href={`/sets/${slug}/${p.slug}-ev`} className="text-primary hover:underline">
                  {p.name}
                </Link>
                <span className="ml-2 text-sm text-muted-foreground">
                  MSRP {formatCents(p.msrp_cents)} · {p.pack_count} packs
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {history.length ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">EV history</h2>
          {plan === "free" ? (
            <p className="text-xs text-muted-foreground">Free plan: last {30} days shown.</p>
          ) : null}
          <EvHistoryChart data={history} />
        </section>
      ) : null}

      <div className="mt-10 flex justify-between text-sm">
        {prev ? (
          <Link href={`/sets/${prev.slug}`} className="text-primary hover:underline">
            ← {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/sets/${next.slug}`} className="text-primary hover:underline">
            {next.name} →
          </Link>
        ) : null}
      </div>

      <EmailCapture source={`set:${slug}`} />

      <p className="mt-8 text-sm">
        <Link href="/tools/fee-calculator" className="text-primary hover:underline">
          Compare marketplace fees
        </Link>
        {" · "}
        <Link href="/tools/grade-or-sell" className="text-primary hover:underline">
          Grade or sell calculator
        </Link>
      </p>
    </div>
  );
}
