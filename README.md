# Rip, Grade or Sell

TCG decision tools: sealed product EV, grade-or-sell ROI, marketplace fees, and pack simulation. Built with Next.js 15, Supabase, and typed ingestion adapters.

## Prerequisites

- Node.js 22+
- npm 10+
- [Supabase CLI](https://supabase.com/docs/guides/cli) and Docker (for local Postgres, Auth, and RLS tests)

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

## CI

GitHub Actions runs lint, typecheck, test, and build on every push to `main`.

## Environment

See `.env.example`. Optional keys (Resend, billing, Sentry, pokemontcg.io) degrade gracefully; local development uses seeded sample data when APIs are unavailable.

## License

Proprietary — see repository terms.
