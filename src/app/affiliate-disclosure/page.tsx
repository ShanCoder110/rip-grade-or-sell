import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliatePage() {
  return (
    <div className="page-narrow prose-page">
      <h1>Affiliate Disclosure</h1>
      <p>
        Some outbound links may be affiliate links, including TCGplayer via Impact and the eBay
        Partner Network. We may earn a commission at no extra cost to you. Program approval is
        tracked on the launch checklist.
      </p>
    </div>
  );
}
