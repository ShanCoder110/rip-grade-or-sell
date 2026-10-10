import { Suspense } from "react";
import type { Metadata } from "next";
import { SetsListBody } from "./sets-list-body";

export const metadata: Metadata = {
  title: "Sets",
  alternates: { canonical: "/sets" },
  description: "Browse TCG sets with pull rates, chase cards, and sealed EV.",
};

export const revalidate = 86400;

export default function SetsPage() {
  return (
    <div className="page">
      <header className="rise">
        <h1 className="h1">Sets</h1>
        <p className="lede">
          Sample and measured expected value by set. Pre-release pages stay up with expected
          rarities until measured pull rates arrive.
        </p>
      </header>
      <Suspense fallback={<SetsListSkeleton />}>
        <SetsListBody />
      </Suspense>
    </div>
  );
}

function SetsListSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <div className="mt-8 space-y-2">
        <div className="skeleton h-14 w-full" />
        <div className="skeleton h-14 w-full" />
      </div>
    </div>
  );
}
