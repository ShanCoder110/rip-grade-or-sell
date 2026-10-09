Prompt 0: Rules

Project: TCG "Rip, Grade or Sell" web app. Helps collectors decide whether to open sealed product, grade a card, or sell it, with net proceeds after fees. Launch with Pokémon, then MTG, Lorcana, One Piece.

Stack: Next.js 15 (App Router, TypeScript strict), Supabase (Postgres, Auth, RLS) via @supabase/ssr and @supabase/supabase-js, Supabase CLI migrations, generated DB types, Tailwind, Recharts, Zod, Vitest + Playwright, Resend, a payments provider behind an adapter (see billing prompt).

Rules:
- Money is integer cents. Never floats.
- Every table has RLS enabled. Public market data is read-only for anon; user tables are owner-only. The service role key is used only in server code (cron, webhooks), never shipped to the client.
- External data goes through typed adapters in /src/lib/sources, validated with Zod.
- Business logic (EV, grading ROI, fees) is pure functions in /src/lib/engine with unit tests. No logic in components.
- Server Components by default; client components only for interactive calculators.
- Paywall checks happen server-side against the entitlements table, never trust the client.
- Every public page: unique metadata, canonical URL, JSON-LD where appropriate.
- Env vars validated with Zod in /src/env.ts. No secrets in code.
- No "Pokémon" in domain or brand. Trademark disclaimer in footer.
- Every data point shows its source and last-updated time.

Prompt 1: Scaffold

Scaffold per the rules: strict tsconfig, ESLint + Prettier, absolute imports, src/env.ts, Tailwind design system (light/dark), root layout with header/footer, /about and /methodology pages, security headers in next.config (CSP, HSTS, X-Frame-Options, Referrer-Policy), Supabase client helpers (browser, server, middleware session refresh), GitHub Actions CI (lint, typecheck, test, build), README with setup. No lorem ipsum.

Prompt 2: Supabase schema and RLS

Using the Supabase CLI, write migrations for: games, sets (slug, name, release_date), cards (set, number, rarity, image, external_ids), products (box/ETB/bundle/pack, msrp_cents, pack_count), price_snapshots (card or product, source, price_cents, captured_on; unique per day per source), pull_rates (set, product, rarity, odds, source_url, source_date, confidence), grading_fees (service, tier, fee_cents, effective_date), profiles (linked to auth.users), subscriptions, entitlements (user_id, plan, status, current_period_end), watchlist_items, alerts, portfolio_items, email_subscribers, ingest_runs. Add indexes for time-series and slug lookups. Enable RLS on everything with policies: public read for market data, owner-only for user data, no client writes to subscriptions/entitlements. Generate TS types and a seed with 2 sample sets. Add a script to test the RLS policies.

Prompt 3: Ingestion and daily cron

Build adapters for pokemontcg.io (sets, cards, prices) and MTGJSON (prices) in /src/lib/sources: Zod validation, retry with backoff, rate-limit awareness, idempotent upserts, one price_snapshot per day per source. Expose /api/cron/ingest protected by CRON_SECRET, using the Supabase service role client, triggered by Vercel Cron or GitHub Actions. Log each run to ingest_runs. First read the pokemontcg.io terms and tell me whether commercial use is restricted.

Prompt 4: EV engine

Build /src/lib/engine/ev.ts as pure functions with full unit tests: grossEV, netEV (platform fee, shipping per card, liquidity haircut for cards under a configurable price), and verdict(sealedPrice, netEV) returning "rip" | "hold" | "skip" with margin. Cover missing prices, zero-odds rarities, integer-cent rounding. Document the formula so I can publish it on /methodology.

Prompt 5: Fee engine

Build /src/lib/engine/fees with effective-dated rules as versioned JSON in /data/fees (eBay, Whatnot, TCGplayer, Mercari, PayPal). netPayout({platform, price, shipping, category, country, date}) returns an itemized breakdown and supports "fees as of date X". Unit test every platform. Leave clearly marked TODOs with source URLs; I will fill in current rates from official pages.

Prompt 6: Set pages

Build /sets and /sets/[slug] with ISR (daily revalidate): per-rarity pull rates with source/date, chase-card table with live prices, gross and net EV for box/ETB/bundle, Rip/Hold verdict, and an EV history chart. Add /sets/[slug]/[product]-ev. Use generateStaticParams and generateMetadata built from real data, breadcrumbs, prev/next set links. Return 404 for any page lacking real data (no thin pages). Free users see 30 days of history; Pro sees all (server-side check).

Prompt 7: Grade-or-Sell calculator

Build /tools/grade-or-sell and /sets/[slug]/cards/[id]/grade: debounced card search; raw vs PSA 9 vs PSA 10 prices; condition self-check mapped to grade probabilities; grading fee, shipping/insurance, sale fees by platform; expected net profit and break-even PSA-10 probability. Logic in /src/lib/engine/grading.ts with tests. Shareable via URL params, OG image per result. Fully free, no login.

Prompt 8: Fee calculator and pack simulator

Build /tools/fee-calculator (net payout across platforms for one item, ranked, itemized) and /tools/pack-simulator (virtual packs using published pull rates, running value total). Fast, accessible, mobile-first, with shareable OG images. Free, no login.

Prompt 9: Auth and billing (paywall)

Add Supabase Auth (email magic link, Google optional) with protected routes via middleware. Build billing behind a BillingProvider interface so the payment provider can be swapped (Lemon Squeezy, Paddle, or Stripe). Plans: Pro $3/month and $24/year. Implement checkout creation, a customer portal link, and a webhook route with signature verification and idempotency that writes subscriptions and entitlements using the service role. Add a server-side helper requirePro() and a <ProGate> component for upsell UI. Enforce limits on the server: free watchlist cap of 5, 30-day history, no alerts/portfolio/CSV. Build /pricing with a free vs Pro table and a cancel-anytime note. Tests for webhook idempotency and the gating logic.

Prompt 10: Pro features

Build the Pro features: unlimited watchlist, daily price/EV threshold email alerts (Resend, triggered by a secured cron route, with unsubscribe links), portfolio EV with CSV import, bulk grade triage via CSV upload (validate and size-limit files). Add a public email capture for "new set EV alerts" on set pages. All gated server-side.

Prompt 11: Technical SEO

Implement per-section sitemaps (sets, cards, tools), robots.txt, canonicals, JSON-LD (SoftwareApplication for tools, BreadcrumbList, FAQPage only for genuine Q&A), internal linking rules (set → product EV → top 10 chase-card grade pages → fee calculator), a visible "Prices updated HH:MM UTC" stamp, and /changelog. Add a pre-release set page template (official card list, expected rarities) that switches to measured rates when data arrives, and use it for Delta Reign.

Prompt 12: Production hardening

Audit and harden: rate limiting on API routes, Zod validation on every route, error boundaries, structured logging, Sentry, health check endpoint, Supabase connection and caching strategy, Core Web Vitals pass (LCP under 1s on set pages), WCAG AA audit, cookie/consent banner, privacy policy, terms, refund policy, affiliate disclosure, and Playwright E2E for: set page, grade-or-sell, signup-to-Pro-checkout. Report anything you could not verify.

Prompt 13: Deploy and launch

Prepare deployment: env var docs, Supabase production project with migrations applied in CI, Vercel config with cron jobs, Supabase backups, uptime monitoring, and a launch checklist covering Search Console, affiliate approvals (TCGplayer via Impact, eBay Partner Network), analytics, and a rollback plan.
