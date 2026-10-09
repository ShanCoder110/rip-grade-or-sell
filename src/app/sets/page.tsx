import Link from "next/link";
import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
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
    <div className="page">
      <header className="rise">
        <h1 className="h1">Sets</h1>
        <p className="lede">
          Sample and measured expected value by set. Pre-release pages stay up with expected
          rarities until measured pull rates arrive.
        </p>
      </header>
      {sets.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No sets yet" body="Sets appear here after the seed or a successful ingest." />
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {sets.map((set) => (
            <li key={set.id}>
              <Link
                href={`/sets/${set.slug}`}
                className="flex flex-col gap-1 px-4 py-4 transition hover:bg-muted/60 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <span className="font-medium">
                  {set.name}
                  {set.is_prerelease ? (
                    <span className="verdict verdict-hold ml-2 !py-0.5 !text-[0.65rem] !tracking-normal">
                      Pre-release
                    </span>
                  ) : null}
                </span>
                <span className="text-sm text-muted-foreground">{set.release_date ?? "Date TBD"}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
