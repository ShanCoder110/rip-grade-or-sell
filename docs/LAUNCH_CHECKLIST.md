# Launch checklist (Prompt 13)

Location: **`docs/LAUNCH_CHECKLIST.md`** (this file).

## Infrastructure

- [ ] Create Supabase production project; apply migrations (`supabase db push` or CI job).
- [ ] Enable daily backups in Supabase dashboard.
- [ ] Configure Vercel project with env vars from `.env.example`.
- [ ] Confirm `vercel.json` cron jobs authorized with `CRON_SECRET`.
- [ ] Set up uptime monitoring (e.g. Better Stack) hitting `/api/health`.

## Search & analytics

- [ ] Google Search Console property + sitemap submit (`/sitemap.xml`).
- [ ] Analytics (Plausible / GA4) with consent banner alignment.

## Affiliates

- [ ] TCGplayer via Impact — application status.
- [ ] eBay Partner Network — campaign approval.

## Product

- [ ] Replace sample fee JSON with verified rates (URLs in `/data/fees`).
- [ ] Verify pokemontcg.io / API terms for production traffic.
- [ ] Stripe live keys + webhook endpoint + Customer Portal.
- [ ] Resend domain verification for alert emails.

## Rollback

- [ ] Vercel instant rollback to previous deployment documented.
- [ ] Database migration rollback plan (forward-only migrations + backup restore).
