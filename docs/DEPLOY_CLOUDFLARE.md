# Deploy to Cloudflare Workers (OpenNext)

This app runs on [Cloudflare Workers](https://developers.cloudflare.com/workers/) using the official [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) adapter (Node.js Next.js runtime on Workers with `nodejs_compat`).

## Architecture

| Component | Purpose |
|-----------|---------|
| **Worker** `rip-grade-or-sell` | OpenNext bundle (`.open-next/worker.js` + static assets) |
| **R2** `rip-grade-or-sell-opennext-cache` | Incremental cache for ISR / `revalidate` (set pages, 24h) |
| **Durable Object** `DOQueueHandler` | Time-based revalidation queue (`NEXT_CACHE_DO_QUEUE`) |
| **Worker** `rip-grade-or-sell-cron` | Cron triggers → service binding → `/api/cron/*` with `CRON_SECRET` |
| **Images binding** `IMAGES` | Optional Next.js image / OG pipeline via Cloudflare Images |

Bindings are declared in [`wrangler.jsonc`](../wrangler.jsonc). Cache overrides are in [`open-next.config.ts`](../open-next.config.ts).

## Prerequisites

1. [Cloudflare account](https://dash.cloudflare.com/sign-up)
2. Workers **Paid** plan recommended (10 MiB worker size; R2 + Durable Objects)
3. [Wrangler](https://developers.cloudflare.com/workers/wrangler/) ≥ 3.99 (installed as devDependency)
4. Supabase production project (migrations applied)

## One-time Cloudflare setup

### 1. API token (for GitHub Actions and CLI)

1. Cloudflare Dashboard → **My Profile** → **API Tokens** → **Create Token**
2. Use template **Edit Cloudflare Workers** (or custom token with):
   - Account: **Workers Scripts** Edit, **Workers KV/R2** Edit, **Account Settings** Read
   - Zone: optional (only if using cache purge on a custom domain)
3. Save the token as GitHub secret `CLOUDFLARE_API_TOKEN`
4. Copy **Account ID** from Workers overview → GitHub secret `CLOUDFLARE_ACCOUNT_ID`

### 2. R2 bucket (ISR cache)

```bash
npx wrangler r2 bucket create rip-grade-or-sell-opennext-cache
```

Name must match `r2_buckets[].bucket_name` in `wrangler.jsonc`.

### 3. Worker secrets and vars

Set **production** values (repeat for preview environments if you use them):

```bash
# Public URL of your site (also set GitHub repository variable NEXT_PUBLIC_APP_URL for CI)
npx wrangler vars set NEXT_PUBLIC_APP_URL "https://your-domain.com"

npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put CRON_SECRET
npx wrangler secret put RESEND_API_KEY
# Optional
npx wrangler secret put SENTRY_DSN
npx wrangler secret put POKEMONTCG_API_KEY
```

Public build-time vars (can be `wrangler vars` or dashboard):

```bash
npx wrangler vars set NEXT_PUBLIC_SUPABASE_URL "https://xxxx.supabase.co"
npx wrangler vars set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJ..."
npx wrangler vars set NEXT_PUBLIC_ADSENSE_CLIENT_ID "ca-pub-..."
npx wrangler vars set NEXT_PUBLIC_ADSENSE_SLOT_HOME "1234567890"
npx wrangler vars set NEXT_PUBLIC_ADSENSE_SLOT_SET "1234567891"
npx wrangler vars set NEXT_PUBLIC_ADSENSE_SLOT_TOOL "1234567892"
npx wrangler vars set ADSENSE_PUBLISHER_ID "pub-1234567890123456"
npx wrangler vars set RESEND_FROM_EMAIL "alerts@yourdomain.com"
```

See [`.env.example`](../.env.example) and [`.dev.vars.example`](../.dev.vars.example) for the full list.

### 4. Cron worker

After the main worker is deployed:

```bash
npx wrangler secret put CRON_SECRET -c workers/cron-dispatcher/wrangler.jsonc
npm run deploy:cron
```

Schedules (UTC): **06:00** ingest (`/api/cron/ingest`), **07:00** alerts (`/api/cron/alerts`). Same `CRON_SECRET` as the Next app.

### 5. Custom domain

Workers & Pages → **rip-grade-or-sell** → **Settings** → **Domains & Routes** → add your apex/www hostname.

Update `NEXT_PUBLIC_APP_URL` to match. In Supabase Auth, add redirect URLs for `https://your-domain.com/auth/callback`.

## Local development

| Command | Use |
|---------|-----|
| `npm run dev` | Standard Next.js dev server (fast UI work) |
| `npm run preview` | Build + **Workers runtime** preview (`opennextjs-cloudflare preview`, default port **8787**) |

For preview, copy `.dev.vars.example` → `.dev.vars` (gitignored). Set `NEXTJS_ENV=development` and your keys.

```bash
cp .dev.vars.example .dev.vars
npm run preview
# http://127.0.0.1:8787
```

## Build & deploy commands

```bash
npm run build          # Next.js only
npm run build:cf       # Next + OpenNext worker bundle
npm run preview        # Local Workers preview
npm run deploy         # Build + deploy main worker
npm run deploy:cron    # Deploy cron dispatcher worker
npm run cf-typegen     # Generate cloudflare-env.d.ts
```

## GitHub Actions

- **CI** (`.github/workflows/ci.yml`): lint, typecheck, test, `next build`, `build:cf`, Playwright
- **Deploy** (`.github/workflows/deploy-cloudflare.yml`):
  - **main** → `opennextjs-cloudflare deploy` + `deploy:cron`
  - **PRs** → `opennextjs-cloudflare upload` (preview version; URL in Actions log)

Required secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`  
Recommended variable: `NEXT_PUBLIC_APP_URL` (production URL for CI builds)

## Supabase production

```bash
npx supabase link --project-ref <ref>
npx supabase db push
```

Apply all migrations under `supabase/migrations/`, including `20260210000000_drop_billing_tables.sql`.

## Google AdSense

1. Apply in AdSense with your **custom domain** (after Workers route is live).
2. Set `ADSENSE_PUBLISHER_ID` so `https://your-domain.com/ads.txt` serves:
   `google.com, pub-XXXXXXXX, DIRECT, f08c47fec0942fa0`
3. Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` and slot env vars.
4. Cookie banner must stay **Accept all** / **Essential only** for UK/EEA.

## Troubleshooting

- **ISR not updating**: confirm R2 bucket exists and `NEXT_INC_CACHE_R2_BUCKET` binding is correct; check DO queue migrations in `wrangler.jsonc`.
- **Cron 401**: `CRON_SECRET` must match on main worker and cron worker.
- **Worker too large**: upgrade to Workers Paid; check `wrangler deploy` gzip size.
- **DO warnings during `next dev`**: expected until `.open-next/worker.js` exists; use `npm run preview` to test DO bindings locally.

## Removed Vercel config

`vercel.json` crons were replaced by the `rip-grade-or-sell-cron` worker. Do not rely on Vercel for this project.
