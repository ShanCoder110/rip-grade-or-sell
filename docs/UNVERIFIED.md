# Unverified / placeholder integrations

Items not fully exercised in CI or production:

- **Resend:** alert digests need a verified domain and live `RESEND_API_KEY`.
- **pokemontcg.io / MTGJSON:** ingestion cron depends on API keys and provider terms.
- **Playwright:** smoke paths only; full Supabase OAuth flow is not automated.
- **Cloudflare deploy:** `wrangler deploy` requires account secrets (see `docs/DEPLOY_CLOUDFLARE.md`).
