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
      <p>Set EV pages, grade-or-sell and fee calculators, pack simulator, and optional sign-in for saved lists.</p>
      <h2>2026-10-10 — Ad-supported, all features free</h2>
      <p>
        Removed subscriptions and Stripe. Watchlist, history, alerts, and portfolio are free. Google
        AdSense loads only after cookie consent.
      </p>
    </div>
  );
}
