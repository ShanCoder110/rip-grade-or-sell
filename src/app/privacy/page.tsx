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
        We collect account email through Supabase Auth when you sign in, plus the watchlist, alert,
        and portfolio rows you choose to save. Essential cookies keep sessions working.
      </p>
      <h2>Advertising cookies</h2>
      <p>
        If you tap <strong>Accept all</strong> on the cookie banner, we load Google AdSense, which
        may set advertising and measurement cookies on your device. In the UK, EEA, and similar
        regions we only enable personalized ads after that consent. Choosing <strong>Essential
        only</strong> keeps AdSense off and shows no ad slots.
      </p>
      <p>
        Google&apos;s use of data from sites that use its services is described in{" "}
        <a href="https://policies.google.com/technologies/partner-sites" className="link">
          How Google uses information from sites or apps that use our services
        </a>
        . You can manage ad personalization in your Google account settings.
      </p>
      <h2>Affiliate links</h2>
      <p>
        Some outbound marketplace links may be affiliate links, as described on the affiliate
        disclosure page. That does not change the fee math shown in the calculators.
      </p>
      <p>Contact: privacy@example.com (replace before launch).</p>
    </div>
  );
}
