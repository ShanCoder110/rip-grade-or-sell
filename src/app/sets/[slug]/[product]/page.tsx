import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PriceStamp } from "@/components/price-stamp";
import { getSetBySlug } from "@/lib/data/sets";
import { computeProductEv, latestCardPrices, latestProductPrice } from "@/lib/engine/set-ev";
import { formatCents } from "@/lib/utils";

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
  const sealed =
    latestProductPrice(set.price_snapshots, p.id) ?? p.msrp_cents;
  const ev = computeProductEv(set.pull_rates, pricesByRarity, p.pack_count, sealed);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs
        items={[
          { href: "/sets", label: "Sets" },
          { href: `/sets/${slug}`, label: set.name },
          { href: `/sets/${slug}/${product}`, label: `${p.name} EV` },
        ]}
      />
      <h1 className="text-3xl font-bold">{p.name}</h1>
      <PriceStamp
        source={set.price_snapshots[0]?.source ?? "seed_sample"}
        updatedAt={new Date().toISOString()}
      />
      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-muted-foreground">Sealed price</dt>
          <dd className="text-lg font-semibold">{formatCents(sealed)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Gross EV</dt>
          <dd className="text-lg font-semibold">{formatCents(ev.gross)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Net EV</dt>
          <dd className="text-lg font-semibold">{formatCents(ev.net.netCents)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Verdict</dt>
          <dd className="text-lg font-semibold capitalize">{ev.verdict}</dd>
        </div>
      </dl>
      <p className="mt-6 text-sm text-muted-foreground">
        Fees, shipping, and liquidity adjustments follow the published{" "}
        <a href="/methodology" className="text-primary underline">methodology</a>.
      </p>
    </div>
  );
}
