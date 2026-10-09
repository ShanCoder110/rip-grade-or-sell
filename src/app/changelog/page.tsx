import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  alternates: { canonical: "/changelog" },
};

export default function ChangelogPage() {
  return (
    <div className="page-narrow prose-page">
      <h1>Changelog</h1>
      <h2>2026-03-26 — Public preview</h2>
      <p>Set EV pages, grade-or-sell and fee calculators, pack simulator, and the Pro billing scaffold.</p>
    </div>
  );
}
