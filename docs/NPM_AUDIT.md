# npm audit triage

Last reviewed: 2026-10-10 (PR #1 / `cursor/adsense-free-model-b5bf`).

## Summary

| When | Total | Moderate | High | Critical |
|------|------:|---------:|-----:|---------:|
| Before QA fixes | 14 | 2 | 10 | 2 |
| After `tinypool` override | 13 | 3 | 10 | 0 |

`npm audit fix` (without `--force`) applies no further safe changes. `npm audit fix --force` would downgrade `@opennextjs/cloudflare`, `eslint-config-next`, or upgrade `next` to 16 — all rejected for this stack (Next 15.5.x + OpenNext Cloudflare).

## Mitigations applied

- **`package.json` → `overrides.tinypool`: `2.2.0`** — Vitest 3.x pulled `tinypool@1.1.1`, which npm flags as critical (prototype pollution → RCE in worker options). Tinypool is **dev-only** (unit test runner); it is not shipped in the Next/OpenNext production bundle. Override bumps tinypool to a patched release while keeping Vitest 3.2.x.

## Accepted findings (not upgraded)

| Package / chain | Severity | Runtime? | Exploitable here? | Reason left |
|-----------------|----------|----------|-------------------|-------------|
| `vitest` → `@vitest/mocker` | moderate | Dev only | Low — requires running Vitest with attacker-controlled mock redirects | Fix needs Vitest ≥4.1.11; `npm install vitest@4` hit an npm resolver error in CI; revisit on next Vitest major bump |
| `eslint-config-next` → `fast-glob` → `micromatch` → `braces` | high | Dev only (ESLint) | Low — DoS via pathological glob patterns during lint | Fix suggests downgrading to eslint-config-next 14; we pin 15.5.27 to match Next 15 |
| `@opennextjs/cloudflare` → `@opennextjs/aws` → `@node-minify/core` → `glob` | high | Build tool only | Low — glob CLI `-c` injection; we do not invoke glob CLI with untrusted args | Fix suggests older `@opennextjs/cloudflare@1.20.9`; current `^1.20.10` is required for Cloudflare adapter |
| `next` → `postcss` | high / moderate | Build + server CSS pipeline | Low for this app — advisories target PostCSS stringify/source-map parsing of **attacker-controlled CSS**; we do not expose PostCSS as a user CSS processor | Requires Next 16; stay on 15.5.27 until OpenNext/Cloudflare support is verified |

## Production surface

Runtime dependencies shipped to users: `next`, `react`, `@supabase/*`, etc. None of the **critical** issues apply after the tinypool override. Remaining highs are either dev-only (ESLint, Vitest) or build-time (OpenNext minify, Next’s bundled PostCSS).

Re-run: `npm audit` after dependency bumps.
