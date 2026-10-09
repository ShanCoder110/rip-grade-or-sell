import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GradeOrSellCalculator } from "@/components/tools/grade-or-sell-calculator";
import { getSetBySlug } from "@/lib/data/sets";

type Props = { params: Promise<{ slug: string; id: string }> };

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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">{card.name}</h1>
      <p className="text-sm text-muted-foreground">{set.name} · #{card.number}</p>
      <GradeOrSellCalculator className="mt-6" />
    </div>
  );
}
