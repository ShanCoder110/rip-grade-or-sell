import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-sm dark:prose-invert">
      <h1>Terms of Service</h1>
      <p>
        Rip, Grade or Sell provides informational tools only — not investment, tax, or legal advice.
        Market prices and pull rates may be inaccurate or outdated.
      </p>
    </div>
  );
}
