import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  alternates: { canonical: "/refund" },
};

export default function RefundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-sm dark:prose-invert">
      <h1>Refund Policy</h1>
      <p>
        Pro subscriptions can be canceled anytime. Refund requests within 7 days of charge are
        reviewed case-by-case via support email (configure before launch).
      </p>
    </div>
  );
}
