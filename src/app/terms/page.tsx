import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="page-narrow prose-page">
      <h1>Terms of Service</h1>
      <p>
        Rip, Grade or Sell is an informational tool. It is not investment, tax, or legal advice.
        Market prices and pull rates can be wrong or stale. You are responsible for decisions you
        make with the numbers.
      </p>
      <h2>Advertising</h2>
      <p>
        The site is free to use and may display third-party advertisements (such as Google AdSense).
        We do not sell subscriptions or digital goods through this service.
      </p>
    </div>
  );
}
