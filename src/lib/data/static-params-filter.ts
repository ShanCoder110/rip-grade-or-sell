/** Slugs to pre-render at build; others still work on demand when dynamicParams is true. */
export function filterSlugsForStaticGeneration(slugs: string[]): string[] {
  const omit = process.env.E2E_OMIT_STATIC_SET_SLUG?.trim();
  if (!omit) return slugs;
  return slugs.filter((s) => s !== omit);
}
