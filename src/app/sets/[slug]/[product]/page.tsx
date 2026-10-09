import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AnimatedCents } from "@/components/animated-cents";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PriceStamp } from "@/components/price-stamp";
import { VerdictBadge } from "@/components/verdict-badge";
import { getSetBySlug } from "@/lib/data/sets";
import { computeProductEv, latestCardPrices, latestProductPrice } from "@/lib/engine/set-ev";

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string; product: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, product } = await params;
  const productSlug = product.replace(/-ev$/, "");
  const set = await getSetBySlug(slug);
  const p = set?.products.find((x) => x.slug === productSlug);
  if (!set || !p) return { title: "Product EV" };
  return {
    title: `${p.name} EV — ${set.name}`,
    alternates: { canonical: `/sets/${slug}/${product}` },
  };
}

export default async function ProductEvPage({ params }: Props) {
  const { slug, product } = await params;
  const productSlug = product.endsWith("-ev") ? product.slice(0, -3) : product;
  const set = await getSetBySlug(slug);
  if (!set || set.is_prerelease) notFound();
  const p = set.products.find((x) => x.slug === productSlug);
  if (!p || !set.pull_rates.length) notFound();

  const pricesByRarity = latestCardPrices(set.price_snapshots, set.cards);
  const sealed = latestProductPrice(set.price_snapshots, p.id) ?? p.msrp_cents;
  const ev = computeProductEv(set.pull_rates, pricesByRarity, p.pack_count, sealed);
  const latestDate =
    set.price_snapshots.reduce(
      (max, s) => (s.captured_on > max ? s.captured_on : max),
      "1970-01-01",
    ) + "T12:00:00Z";
  const source = set.price_snapshots.find((s) => s.product_id === p.id)?.source ?? set.price_snapshots[0]?.source ?? "seed_sample";

  const stats = [
    { label: "Sealed price", cents: sealed },
    { label: "Gross EV", cents: ev.gross },
    { label: "Net EV", cents: ev.net.netCents },
  ];

  return (
    <div className="page-narrow">
      <Breadcrumbs
        items={[
          { href: "/sets", label: "Sets" },
          { href: `/sets/${slug}`, label: set.name },
          { href: `/sets/${slug}/${product}`, label: `${p.name} EV` },
        ]}
      />
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="h1">{p.name}</h1>
        <VerdictBadge verdict={ev.verdict} />
      </div>
      <PriceStamp source={source} updatedAt={latestDate} />
      <dl className="mt-8 grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </dt>
            <dd className="mt-2 text-2xl font-semibold">
              <AnimatedCents cents={stat.cents} />
            </dd>
            <dd className="mt-1 text-xs text-muted-foreground">Source {source}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-sm text-muted-foreground">
        Fees, shipping, and the liquidity haircut follow the published{" "}
        <Link href="/methodology" className="link">
          methodology
        </Link>
        .
      </p>
    </div>
  );
}
