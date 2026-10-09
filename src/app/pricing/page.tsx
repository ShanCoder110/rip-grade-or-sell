import Link from "next/link";
import type { Metadata } from "next";
import { PricingActions } from "@/components/pricing-actions";
import { isDemoBillingEnabled } from "@/lib/auth/demo-mode";
import { readDemoSession } from "@/lib/auth/demo-session";
import { getUserPlan } from "@/lib/auth/entitlements";
import { hasPublicSupabaseConfig } from "@/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pricing",
  alternates: { canonical: "/pricing" },
  description:
    "Free calculators, or Pro for $3/month or $24/year. Unlimited watchlist, full history, alerts, and portfolio. Cancel anytime.",
};

const faqs = [
  {
    q: "What do I get for free?",
    a: "Set EV, the grade-or-sell calculator, the fee calculator, and the pack simulator. A free account can watch up to 5 cards and see 30 days of history.",
  },
  {
    q: "What does Pro include?",
    a: "Pro is $3 per month or $24 per year. It removes the watchlist cap, unlocks full price and EV history, sends threshold email alerts, and enables portfolio tracking with CSV import and bulk grade triage.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel whenever you want. The demo checkout used when Stripe is not configured does not charge a card. Live billing is handled by Stripe, and the refund policy explains review of recent charges.",
  },
  {
    q: "Is this investment advice?",
    a: "No. Figures are estimates from cited sources. Prices and pull rates can be wrong or stale. You decide what to rip, grade, or sell.",
  },
];

const rows = [
  ["Set EV, grade-or-sell, fee calculator, pack simulator", "Yes", "Yes"],
  ["Watchlist", "5 cards", "Unlimited"],
  ["Price and EV history", "30 days", "Full history"],
  ["Email alerts", "No", "Yes"],
  ["Portfolio and CSV import", "No", "Yes"],
  ["Price", "$0", "$3/month or $24/year"],
];

type Props = { searchParams: Promise<{ checkout?: string }> };

async function signedIn(): Promise<boolean> {
  if (await readDemoSession()) return true;
  if (!hasPublicSupabaseConfig()) return false;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return Boolean(data.user);
  } catch {
    return false;
  }
}

export default async function PricingPage({ searchParams }: Props) {
  const { checkout } = await searchParams;
  const demo = isDemoBillingEnabled();
  const plan = await getUserPlan();
  const authed = await signedIn();
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Pro subscription</p>
        <h1 className="h1 mt-2">Pricing</h1>
        <p className="lede">
          The decision tools are free. Pro is the paid plan: $3 a month or $24 a year, and you can
          cancel anytime.
        </p>
      </header>

      {demo ? (
        <p className="card mt-6 p-4 text-sm" role="note">
          Demo checkout is on because Stripe keys are missing. Subscribing here unlocks Pro in this
          browser only. No card is charged.
        </p>
      ) : null}

      {checkout === "success" && plan === "pro" ? (
        <p className="card mt-4 border-[var(--success)] p-4 text-sm" role="status">
          Pro is active. Demo checkout did not charge a card. Open the watchlist, alerts, or
          portfolio to use Pro tools. Cancel anytime.
        </p>
      ) : null}
      {checkout === "success" && plan !== "pro" ? (
        <p className="card mt-4 p-4 text-sm" role="status">
          Stripe received the return from checkout. Pro turns on when the webhook confirms the
          subscription.
        </p>
      ) : null}
      {checkout === "cancel" ? (
        <p className="card mt-4 p-4 text-sm" role="status">
          Checkout canceled. You were not charged.
        </p>
      ) : null}

      <div className="mt-8 overflow-x-auto">
        <table className="data-table min-w-[36rem]">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Free</th>
              <th>Pro</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-xl font-semibold">Free</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight">$0</p>
          <p className="mt-3 text-sm text-muted-foreground">Use the calculators with no account.</p>
        </section>
        <section className="card border-accent p-6">
          <h2 className="text-xl font-semibold">Pro</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight">
            $3<span className="text-base font-medium text-muted-foreground">/month</span>
          </p>
          <p className="text-sm text-muted-foreground">or $24/year · cancel anytime</p>
          <PricingActions className="mt-6" signedIn={authed} demoMode={demo} />
        </section>
      </div>

      <section className="mt-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="h2">
          FAQ
        </h2>
        <div className="mt-4 space-y-3">
          {faqs.map((item) => (
            <details key={item.q} className="card p-4">
              <summary className="cursor-pointer font-medium">{item.q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="mt-8 text-sm text-muted-foreground">
        <Link href="/refund" className="link">
          Refund policy
        </Link>
      </p>
    </div>
  );
}
