import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  alternates: { canonical: "/refund" },
};

export default function RefundPage() {
  return (
    <div className="page-narrow prose-page">
      <h1>Refund Policy</h1>
      <p>
        Pro subscriptions can be canceled at any time. Refund requests within 7 days of a charge
        are reviewed individually. Set the support address before launch.
      </p>
    </div>
  );
}
