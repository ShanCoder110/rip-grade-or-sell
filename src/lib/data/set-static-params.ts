import { filterSlugsForStaticGeneration } from "@/lib/data/static-params-filter";
import { getAllSetSlugs, getSetBySlug } from "@/lib/data/sets";

export async function generateSetSlugParams() {
  const slugs = filterSlugsForStaticGeneration(await getAllSetSlugs());
  return slugs.map((slug) => ({ slug }));
}

export async function generateSetProductParams() {
  const slugs = filterSlugsForStaticGeneration(await getAllSetSlugs());
  const params: { slug: string; product: string }[] = [];
  for (const slug of slugs) {
    const set = await getSetBySlug(slug);
    if (!set || set.is_prerelease) continue;
    for (const p of set.products) {
      params.push({ slug, product: `${p.slug}-ev` });
    }
  }
  return params;
}

export async function generateSetCardGradeParams() {
  const slugs = filterSlugsForStaticGeneration(await getAllSetSlugs());
  const params: { slug: string; id: string }[] = [];
  for (const slug of slugs) {
    const set = await getSetBySlug(slug);
    if (!set) continue;
    for (const card of set.cards) {
      params.push({ slug, id: card.id });
    }
  }
  return params;
}
