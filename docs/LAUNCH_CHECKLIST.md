# Launch checklist (Prompt 13)

Location: **`docs/LAUNCH_CHECKLIST.md`** (this file).

## Infrastructure

- [ ] Create Supabase production project; apply migrations (`supabase db push` or CI job).
- [ ] Enable daily backups in Supabase dashboard.
- [ ] Follow **[DEPLOY_CLOUDFLARE.md](./DEPLOY_CLOUDFLARE.md)**: R2 bucket, Workers deploy, secrets, custom domain.
- [ ] GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`; variable `NEXT_PUBLIC_APP_URL`.
- [ ] Deploy cron worker (`npm run deploy:cron`) and set `CRON_SECRET` on both workers.
- [ ] Set up uptime monitoring (e.g. Better Stack) hitting `/api/health`.

## Search & analytics

- [ ] Google Search Console property + sitemap submit (`/sitemap.xml`).
- [ ] Google AdSense approval, `ads.txt` via `ADSENSE_PUBLISHER_ID`, and cookie banner tested for UK/EEA.

## Affiliates

- [ ] TCGplayer via Impact — application status.
- [ ] eBay Partner Network — campaign approval.

## Product

- [ ] Replace sample fee JSON with verified rates (URLs in `/data/fees`).
- [ ] Verify pokemontcg.io / API terms for production traffic.
- [ ] Resend domain verification for alert emails.

## Rollback

- [ ] Vercel instant rollback to previous deployment documented.
- [ ] Database migration rollback plan (forward-only migrations + backup restore).
