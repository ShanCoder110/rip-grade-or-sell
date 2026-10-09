import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliatePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-sm dark:prose-invert">
      <h1>Affiliate Disclosure</h1>
      <p>
        Some outbound links may be affiliate links (TCGplayer via Impact, eBay Partner Network). We
        may earn a commission at no extra cost to you. Approval status varies — see launch checklist.
      </p>
    </div>
  );
}
