import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-sm dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>
        We collect account email via Supabase Auth, optional portfolio/watchlist data you store, and
        analytics events when enabled. Payment data is processed by our billing provider; we do not
        store full card numbers.
      </p>
      <p>Contact: privacy@example.com (update before launch).</p>
    </div>
  );
}
