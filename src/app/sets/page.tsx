import Link from "next/link";
import type { Metadata } from "next";
import { listSets } from "@/lib/data/sets";

export const metadata: Metadata = {
  title: "Sets",
  alternates: { canonical: "/sets" },
  description: "Browse TCG sets with pull rates, chase cards, and sealed EV.",
};

export const revalidate = 86400;

export default async function SetsPage() {
  const sets = await listSets();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Sets</h1>
      <p className="mt-2 text-muted-foreground">
        Sample and measured EV by set. Pre-release sets show expected rarities until pull data
        arrives.
      </p>
      <ul className="mt-8 divide-y divide-border rounded-lg border border-border">
        {sets.map((set) => (
          <li key={set.id}>
            <Link
              href={`/sets/${set.slug}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-muted/50"
            >
              <span>
                {set.name}
                {set.is_prerelease ? (
                  <span className="ml-2 rounded bg-muted px-2 py-0.5 text-xs">Pre-release</span>
                ) : null}
              </span>
              <span className="text-sm text-muted-foreground">{set.release_date ?? "TBD"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
