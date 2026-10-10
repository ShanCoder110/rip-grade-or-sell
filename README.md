# Rip, Grade or Sell

TCG decision tools: sealed product EV, grade-or-sell ROI, marketplace fees, and pack simulation. Built with Next.js 15, Supabase, and typed ingestion adapters. The site is free for collectors and funded by optional Google AdSense ads (after cookie consent).

## Prerequisites

- Node.js 22+
- npm 10+
- [Supabase CLI](https://supabase.com/docs/guides/cli) and Docker (for local Postgres, Auth, and RLS tests). **This cloud agent environment did not have Docker** — migrations and scripts are still provided; run them on a machine with Docker Desktop or Linux Docker.

## Setup

```bash
cp .env.example .env.local
# Fill keys from `supabase start` output when running locally

npm install
```

### Local Supabase

```bash
npx supabase start
npx supabase db reset   # migrations + seed
npm run db:types        # regenerate src/types/database.ts
npm run test:rls        # policy smoke tests (requires local stack)
```

### App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo sign-in

When Supabase env vars are unset and `NODE_ENV` is not `production`, the login page offers a **demo account** cookie so you can open `/app/watchlist`, portfolio, and alerts without email auth.

### AdSense

Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (`ca-pub-…`) and per-placement slot env vars. Ads load only after the user chooses **Accept all** on the cookie banner. Configure `ADSENSE_PUBLISHER_ID` so `/ads.txt` serves the correct `google.com, pub-…` line.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright (when configured) |
| `npm run db:types` | Generate Supabase types |
| `npm run test:rls` | RLS policy script |

## Deploy (Cloudflare Workers)

Production hosting uses **OpenNext** on Cloudflare Workers (not Vercel). See **[docs/DEPLOY_CLOUDFLARE.md](docs/DEPLOY_CLOUDFLARE.md)** for R2 cache bindings, cron worker, secrets, and custom domain steps.

```bash
npm run preview   # Workers runtime locally (port 8787)
npm run deploy    # Build + deploy to Cloudflare
```

## CI

GitHub Actions runs lint, typecheck, test, `next build`, OpenNext `build:cf`, and Playwright on every push/PR. Pushes to `main` also deploy via `.github/workflows/deploy-cloudflare.yml` when Cloudflare secrets are configured.

## Environment

See `.env.example`. Optional keys (Resend, AdSense, Sentry, pokemontcg.io) degrade gracefully; local development uses seeded sample data when APIs are unavailable.

## License

Proprietary — see repository terms.
