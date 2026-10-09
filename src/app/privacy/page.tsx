import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="page-narrow prose-page">
      <h1>Privacy Policy</h1>
      <p>
        We collect account email through Supabase Auth, the watchlist and portfolio rows you save,
        and analytics events only after you accept optional cookies. Payment details are handled by
        the billing provider. We do not store full card numbers.
      </p>
      <p>Contact: privacy@example.com (replace before launch).</p>
    </div>
  );
}
