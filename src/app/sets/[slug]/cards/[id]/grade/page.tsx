import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GradeOrSellCalculator } from "@/components/tools/grade-or-sell-calculator";
import { generateSetCardGradeParams } from "@/lib/data/set-static-params";
import { getSetBySlug } from "@/lib/data/sets";

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string; id: string }> };

export async function generateStaticParams() {
  return generateSetCardGradeParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, id } = await params;
  const set = await getSetBySlug(slug);
  const card = set?.cards.find((c) => c.id === id);
  if (!card) return { title: "Grade card" };
  return {
    title: `Grade or sell — ${card.name}`,
    alternates: { canonical: `/sets/${slug}/cards/${id}/grade` },
  };
}

export default async function CardGradePage({ params }: Props) {
  const { slug, id } = await params;
  const set = await getSetBySlug(slug);
  const card = set?.cards.find((c) => c.id === id);
  if (!set || !card) notFound();

  return (
    <div className="page-narrow">
      <Breadcrumbs
        items={[
          { href: "/sets", label: "Sets" },
          { href: `/sets/${slug}`, label: set.name },
          { href: `/sets/${slug}/cards/${id}/grade`, label: card.name },
        ]}
      />
      <h1 className="h1">{card.name}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {set.name} · #{card.number} · {card.rarity}
      </p>
      <Suspense fallback={<div className="skeleton mt-6 h-80 w-full" />}>
        <GradeOrSellCalculator className="mt-6" />
      </Suspense>
    </div>
  );
}
