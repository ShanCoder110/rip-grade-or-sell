import { listSets } from "@/lib/data/sets";

export async function getAdjacentSets(slug: string) {
  const sets = await listSets();
  const idx = sets.findIndex((s) => s.slug === slug);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: sets[idx + 1] ?? null,
    next: sets[idx - 1] ?? null,
  };
}
