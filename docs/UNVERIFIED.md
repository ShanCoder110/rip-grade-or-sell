# Prompt 12 — items not verified in this environment

- **Docker / Supabase local stack:** Docker was not available; migrations, seed, `npm run db:types`, and `npm run test:rls` were not executed against a live database.
- **Core Web Vitals / LCP &lt; 1s** on set pages: no Lighthouse run against production hardware.
- **WCAG AA:** manual audit not performed (basic semantic HTML and labels only).
- **Sentry:** `SENTRY_DSN` optional; no live error event verified.
- **Stripe / Lemon Squeezy / Paddle:** checkout and webhooks use mock/placeholder paths without live provider calls.
- **Resend:** alert cron skips send without API key; unsubscribe flow not end-to-end tested.
- **pokemontcg.io ingestion:** not run without `POKEMONTCG_API_KEY` and Supabase service role.
- **Playwright signup-to-Pro-checkout:** E2E covers smoke paths only, not full OAuth + Stripe.
- **Affiliate program approvals:** documented only in launch checklist.
- **Fee rate accuracy:** all marketplace percentages marked TODO against official URLs.
