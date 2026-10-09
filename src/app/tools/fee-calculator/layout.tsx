import { publicEnv } from "@/env.public";

export default function FeeCalculatorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Marketplace Fee Calculator",
    applicationCategory: "FinanceApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: `${publicEnv.NEXT_PUBLIC_APP_URL}/tools/fee-calculator`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
