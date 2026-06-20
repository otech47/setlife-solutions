# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - start Next.js dev server at `localhost:3000` (API explorer at `localhost:3000/api/v1`)
- `npm run build` - production build
- `npm run start` - serve the production build
- `npm run lint` - run `next lint` (Airbnb + React rules; see `.eslintrc.js` - note 4-space indent, single quotes)
- `npm run order-strings` - alphabetize `constants/strings.ts` by export name
- `npx sequelize-cli db:migrate` - apply DB migrations (config wired via `.sequelizerc`)
- `npx sequelize-cli migration:generate --name <name>` - scaffold a new migration in `pages/api/migrations/`
- `npm run test:visual` - Playwright visual-regression diff of staging vs prod (see Testing below)
- Node version is pinned to `18.x` (see `engines` in `package.json`).

## Testing

There is no unit/integration test runner. The only automated tests are the
Playwright **visual-regression** suite under `tests/visual/` (see
`tests/visual/README.md`).

- Purpose: guard against unintended *stylistic* regressions by pixel-diffing
  every route on **staging** against the same route on **prod**. Prod is the
  model; staging must match it. Read-only - no forms are submitted, no writes.
- It compares two LIVE environments, so **staging must be scaled up** first
  (`heroku ps:scale web=1 -a setlife-solutions-staging`, wait ~15s for the
  cold-start race, then scale back to 0 when done - but during a deploy flow,
  keep it up for the user to review per guardrail #7). This is the gate to run
  before deploying prod.
- Genuinely random regions (e.g. the shuffled `.ProjectSimilarWork` section on
  project detail pages) are **hidden** (`display:none`) during capture, not
  paint-masked - a mask keeps the element's box, so a variable-height random
  region still shifts the layout below it. Their styling is covered elsewhere
  (`.ProjectSimilarWork` tiles use `ProjectTile`, compared in full on
  `/projects`). See `tests/visual/lib/masks.ts`.
- `npm run test:visual` enumerates project/service detail-page IDs from prod's
  GraphQL (`tests/visual/generate-routes.mjs` -> git-ignored
  `routes.generated.json`), then runs the diff; `npm run test:visual:report`
  opens the HTML report with prod/staging/diff images.
- It does NOT run on Heroku (no browser in the slug) and is not part of the
  build - it is a local/CI pre-deploy check. Adding `@playwright/test` as a
  devDependency does not affect the production deploy.

## Architecture

Next.js 12 monolith (pages router) that serves both the marketing/site frontend and its own GraphQL backend from one process. There is no separate server - everything runs under `next`.

### Request flow

- Browser → React pages under `pages/` → Apollo Client (`config/apollo-client.ts`, wired in `pages/_app.tsx`).
- Apollo Client points at `process.env.API_V1_URL` (e.g. `http://localhost:6101/api/v1` in dev). The site talks to its *own* `/api/v1` endpoint over HTTP - frontend and backend are not co-resolved in-process.
- `pages/api/v1.ts` is the GraphQL endpoint. It boots an `ApolloServer` (apollo-server-micro) wrapped in `micro-cors`, with `bodyParser: false` in the route config (required by apollo-server-micro).
- The Apollo `context` spreads `db.models` so every resolver receives Sequelize models directly as context fields (no separate dataloaders / services layer).

### GraphQL schema assembly

- `pages/api/graphql/schema/index.ts` is the single source of truth: it imports every type from `schema/types/*` and every resolver from `schema/resolvers/*`, merges them with `@graphql-tools/merge`, and builds an executable schema.
- **Adding a new GraphQL entity requires three coordinated edits:** create `schema/types/XType.ts`, create `schema/resolvers/XResolver.ts`, and register both in `schema/index.ts`. They will not be auto-discovered.
- Types are defined with `gql\`\`` template literals exported via `module.exports`. Resolvers receive `(parent, args, context)` where `context` is `db.models` spread - so a resolver pulls e.g. `Project` straight out of context.

### Data layer

- Postgres via Sequelize. Models live in `pages/api/models/` and are registered in `pages/api/models/index.ts`, which also defines all associations in a single `associations()` call at the bottom - when adding a model, register it in the `models` object *and* add its associations there.
- **Site content is DB data, not source.** Project/service copy, links, and images are rows in Postgres — there are no seeders in the repo. To change what the site displays (a project's CTA, a tile link-out, body copy, a detail image), write a **data migration** that updates rows; do **not** look for this content in `pages/` or `components/`, and do not hardcode it. Convention: a project's detail CTA is a `project_resource`; a tile/card link-out is an `other_resource`.
- Schema changes go through migration files in `pages/api/migrations/` (Sequelize CLI). Heroku runs `npx sequelize-cli db:migrate` in the release phase on every deploy, so a model edit alone does not change the DB - you must also write a migration. Local dev: run `npx sequelize-cli db:migrate` after pulling changes that include new migrations.
- **Writing new migrations: include `created_at` and `updated_at` columns explicitly in `createTable` calls.** All current tables have these columns because `sync({ alter: true })` historically added them; the createTable migrations themselves omit them. Without sync running anymore, new tables will be missing timestamps unless you add the columns yourself (or pass `{ timestamps: true }` to a custom helper).
- DB credentials are read by `config/credentials.ts` from `.env` (`POSTGRES_DB_*`). Sequelize CLI uses `pages/api/models/config.js`, which imports the same credentials module - `.sequelizerc` points the CLI at this config plus the migrations/models dirs.
- DB connection forces SSL with `rejectUnauthorized: false` (configured for hosted Postgres). Local Postgres typically does not accept SSL - expect connection failures unless your local DB has SSL enabled or you temporarily relax `dialectOptions.ssl`.

### Frontend conventions

- Pages: `pages/index.tsx` plus subfolders (`consultation/`, `projects/`, `services/`, `service-packages/`, `contributor-inquiry/`). `_app.tsx` wraps every page in `ApolloProvider` + a global `Layout` and conditionally injects the Google Analytics gtag script.
- Reusable React components are flat in `components/` (no per-component folders). TypeScript prop interfaces are split out into `interfaces/` (e.g. `ProjectProps.ts`).
- GraphQL operations the *frontend* uses are in `operations/queries/` and `operations/mutations/` as `gql` template literals - keep new client-side queries there rather than inline in components.
- Static copy lives in `constants/strings.ts` as named exports. Run `npm run order-strings` after adding new ones; the script alphabetizes by export name.
- Styling: Tailwind (see `tailwind.config.js`) plus SCSS under `styles/` (entry: `styles/index.scss`, imported in `_app.tsx`). The brand palette is teal/black/white/gray; `tailwind.config.js` extends it with shades/utilities the UI relies on — `primary-dark`/`primary-tint`, the `teal-gradient`/`hero-glow` backgrounds, a `soft`/`card`/`card-hover`/`glow` shadow scale, and a `fade-up` keyframe. Reuse these rather than adding new one-off colors.
- Service tiles render icons from a bundled, keyword-matched set (`components/ServiceIcon.tsx`) because services have no `tile_image_url` in the DB and S3 isn't wired up; a real `tile_image_url` still takes precedence if one is added. `Button` supports `variant`/`type`/`onClick`; `FormSection` (the consultation accordion) supports controlled `isOpen`/`onToggle` as well as uncontrolled use.

### Other backend routes

- `pages/api/contributor-inquiry-form.ts`, `pages/api/sendgrid.ts`, `pages/api/webhooks/discord.ts` - non-GraphQL REST handlers for email + Discord notifications. SendGrid via `@sendgrid/mail`, Discord via `discord-webhook-node`.
- `utilities/s3.ts` wraps `aws-sdk` for asset uploads (project/service images stored on S3, surfaced via `*_image_url` columns on the models).

### Env vars

Required for full functionality (see `.env.example`): `POSTGRES_DB_*`, `API_V1_URL`, `SENDGRID_API_KEY`, `CONSULTATION_FORM_EMAIL`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `DISCORD_WEBHOOK`, `NEXT_PUBLIC_GOOGLE_ANALYTICS`. Only a curated subset is exposed to the client through `env` in `next.config.js` - DB credentials are intentionally **not** in that list (a recent commit removed them; do not re-add).

## Deployment

**Target: Heroku, manual `git push` deploys, no auto-deploy from GitHub.** Validated against the live Heroku environment 2026-05-27.

### Branch model

- **`develop`** is the integration branch. All work (features, fixes, hotfixes, doc changes) lands here via PR. Open PRs against `develop`, not `master`.
- **`master`** is a mirror of what is currently deployed to Heroku production. Nothing lands on `master` except by merging `develop` into it as part of a prod deploy.
- **Staging deploys come from `develop`** (or any feature branch you want to test). Push to `heroku-staging` with `git push heroku-staging <branch>:master`.
- **Prod deploys come from `master`** by **building on prod** (`git push heroku-prod master`), **NOT** `heroku pipelines:promote`. The flow is: merge `develop` into `master`, then push `master` to the prod remote so Heroku rebuilds the slug with prod's config. `master` HEAD should always equal the SHA running on `setlife-solutions`.
  - **Why not promote (critical, verified 2026-06-08):** `next.config.js` inlines its `env` vars — including `API_V1_URL` — into the **client bundle at build time**. Staging builds bake in staging's `API_V1_URL` (`staging.setlife.solutions`). `pipelines:promote` copies that exact staging slug to prod **without rebuilding**, so prod would serve a bundle that calls the **staging** API/DB (and staging is normally scaled to 0 → prod data breaks). Building on prod bakes the correct `www` API. The prod release history confirms this is the real model: every release is a `Deploy <sha>` (a git push build), never a `Promote`.

This means: if you look at `git log master` and the latest commit is not the SHA in `heroku releases -a setlife-solutions`, something has drifted and needs reconciling before the next deploy.

### The pipeline

Heroku pipeline `setlife-solutions`, owned by team `setlife-development`. Two apps:

| Stage | App name | URL | Git remote | Status |
|---|---|---|---|---|
| **Production** | `setlife-solutions` | `www.setlife.solutions` | `https://git.heroku.com/setlife-solutions.git` | 1 Basic web dyno, last deploy 2026-06-08 (`3ebee6a`, release v92) |
| **Staging** | `setlife-solutions-staging` | `staging.setlife.solutions` | `https://git.heroku.com/setlife-solutions-staging.git` | **Normally scaled to 0 dynos to save billing.** Scale up before use, scale down when done (see below). |

Both apps: `heroku/nodejs` buildpack on the `heroku-24` stack, `heroku-postgresql:essential-0` addon. **Review Apps are disabled** (and should stay disabled). GitHub auto-deploy is not configured - every release on prod has been authored by `oscar@setlife.network` via manual `git push`.

### What's in the repo

- **`Procfile`** - `release: npx sequelize-cli db:migrate` runs Sequelize migrations before the new dyno takes traffic; `web: npm start` boots the app. Build runs automatically via the buildpack (`npm run build` → `next build`). The release phase requires `sequelize-cli` to be present in the slug, which means `NPM_CONFIG_PRODUCTION=false` must be set on the Heroku app (already set on both staging and prod).
- **`app.json`** - Heroku Platform API manifest. Declares the buildpack, the `heroku-postgresql` addon, and the env var contract. Only consumed by `heroku create --manifest` / Review Apps / the Deploy button - *not* read on normal `git push heroku master`. Useful as the canonical env var inventory and for future fresh-account bootstrapping.

### How to deploy a code change

The flow is **staging first, verify, then build the same commit on prod** with `git push heroku-prod master`. Do **NOT** `heroku pipelines:promote` — it copies staging's slug (with staging's build-time-inlined `API_V1_URL`) to prod and points prod at the staging DB. See the "Why not promote" note under Branch model.

**Step 1 - preflight (catches the recurring build-breakage failure mode from PRs #281 / #282):**
```bash
npm run build    # MUST pass locally. Heroku has no CI; if next build fails on the slug, the deploy fails after the fact.
```

**Step 2 - add the Heroku git remotes (one-time per checkout):**
```bash
heroku git:remote -a setlife-solutions-staging -r heroku-staging
heroku git:remote -a setlife-solutions         -r heroku-prod
```

**Step 3 - deploy `develop` to staging:**
```bash
git checkout develop && git pull
git push heroku-staging develop:master
# Staging is normally scaled to 0 to save billing. To run + verify:
heroku ps:scale web=1 -a setlife-solutions-staging
heroku logs --tail -a setlife-solutions-staging   # watch boot
# Wait ~15s after boot before hitting /api/v1 - see cold-start race in Landmines.
# Verify at https://staging.setlife.solutions
npm run test:visual   # pixel-diff staging vs prod; review any flagged routes (see Testing)
# LEAVE STAGING UP for the user to review - this is the whole point of a staging
# deploy. Do NOT scale to 0 here. Only scale back down AFTER the user has
# reviewed staging AND the prod deploy is done (or they've decided not to ship).
# Tearing it down right after your own automated checks defeats the purpose.
# See guardrail #7. To scale down once the user is finished:
#   heroku ps:scale web=0 -a setlife-solutions-staging
```

**Turning staging on/off (without redeploying):** scaling is independent of the deployed slug. Use this any time you want to verify staging or just leave it cold:
```bash
heroku ps:scale web=1 -a setlife-solutions-staging   # ON  - ~$0.01/hr Basic dyno
heroku ps:scale web=0 -a setlife-solutions-staging   # OFF - dyno billing stops
```
The `heroku-postgresql:essential-0` addon (~$5/mo) keeps running regardless of dyno state, so the DB persists across on/off cycles.

**Step 4 - merge develop into master, then build it on prod** (`git push heroku-prod`, NOT promote - promotion would ship staging's build-time-inlined `API_V1_URL` and point prod at the staging DB):
```bash
git checkout master && git pull
git merge --ff-only develop   # fast-forward only; if it fails, develop has not absorbed master's history yet
git push origin master
git push heroku-prod master   # rebuilds the slug on prod with prod's env (correct www API_V1_URL baked in)
```
The `git merge --ff-only` step is what keeps the model honest: master HEAD will equal the slug's source SHA after the build completes. After deploying, sanity-check the baked API target: the prod client bundle must reference only `www.setlife.solutions/api/v1`, never `staging` (grep the `_app-*.js` chunk).

**Step 5 - verify prod and have a rollback ready:**
```bash
heroku logs --tail -a setlife-solutions    # watch boot
heroku releases -a setlife-solutions -n 5  # confirm new release is current
# if anything is wrong, immediate rollback:
heroku releases:rollback v<previous> -a setlife-solutions
```

### Guardrails for agents operating this workflow

These are not suggestions. Future Claude sessions deploying this app MUST follow them.

1. **Confirm with the user before any `heroku` command that mutates state.** Mutating commands include `git push heroku-*`, `pipelines:promote`, `config:set`, `ps:scale`, `addons:create`, `addons:destroy`, `reviewapps:enable`, `releases:rollback`, `apps:destroy`. Read-only commands (`apps:info`, `releases`, `ps`, `logs`, `config --json | jq keys`) are fine to run without confirmation.
2. **Never run `heroku config -a <app>` without `--json | jq 'keys[]'`.** Bare `heroku config` dumps every secret value (SendGrid key, DB password, Discord webhook) into the conversation context. Always pipe to `jq keys` when you only need names. Use `heroku config:get <SPECIFIC_KEY>` if you need a single value.
   - **Also: `heroku config:set` echoes the values it just set into stdout.** When setting a secret, append `>/dev/null` or set it via the Heroku dashboard. Anti-pattern: `heroku config:set PASSWORD=...` - the password lands in your logs. Correct: `heroku config:set PASSWORD=... -a <app> >/dev/null`.
3. **Deploy prod by building on prod (`git push heroku-prod master`), NOT `pipelines:promote`.** Always verify on staging first, but ship to prod with a fresh prod build — promoting the staging slug bakes staging's `API_V1_URL` into prod and points it at the staging DB (see Branch model). Never skip the staging verification step.
4. **Always run `npm run build` locally before pushing anything.** There is no CI. Build failures hit Heroku and the previous slug keeps serving - easy to assume success.
5. **Before deploying prod, confirm staging actually came up.** `heroku ps:scale web=1` + `heroku logs --tail` + load the staging URL in a browser-equivalent (or ask the user to). A successful `git push` only proves the slug compiled, not that the app boots.
6. **For prod deploys specifically: get explicit user go-ahead on the deploy, in writing in the chat.** Confirmation for staging is lighter; for prod it's a hard gate.
7. **Do not scale staging to 0 until the user is finished with it.** A staging deploy exists so the *user* can review the live site - not just so you can run automated checks. After you verify, leave `web=1` and hand staging to the user. Only run `heroku ps:scale web=0 -a setlife-solutions-staging` once they have reviewed it **and** the prod deploy is complete (or they've explicitly decided not to deploy). When you say "staging only for now," that means *leave it running*. Tearing it down right after your own checks defeats the entire purpose of staging.

### Known landmines

- **Schema changes require both a model edit and a migration file.** Heroku runs `npx sequelize-cli db:migrate` in release phase, but only against migration files. Editing a model file without a matching migration creates a runtime mismatch (model expects columns that don't exist in the DB, or vice versa). Sequelize CLI generates migration scaffolding: `npx sequelize-cli migration:generate --name <name>`.
- **Release-phase failures block the deploy.** A failing migration aborts the release; the previous slug keeps serving. This is safer than the old sync model (which would silently mutate schema), but you'll see the deploy fail and need to fix the migration before retrying. Recovery: `heroku releases -a <app>` shows the failed release; logs are in `heroku logs --source app --dyno release -a <app>`.
- **Daily Postgres backups are scheduled on prod at 02:00 ET.** Capture an extra one before risky migrations: `heroku pg:backups:capture -a setlife-solutions`. Restore: `heroku pg:backups:restore <id> DATABASE -a setlife-solutions --confirm setlife-solutions`. Prod also has Continuous Protection (PITR) enabled for rollback to any point in the retention window.
- **The Next.js build hard-requires `DISCORD_WEBHOOK` to be set to *something*.** `pages/api/webhooks/discord.ts` constructs `new Webhook(process.env.DISCORD_WEBHOOK)` at module top level, which crashes the build during static page collection if the var is undefined. For non-prod environments where you don't want real Discord posts, set a placeholder URL: `heroku config:set DISCORD_WEBHOOK="https://discord.com/api/webhooks/0/placeholder" -a <app> >/dev/null`.
- **Staging's `DATABASE_URL` and `HEROKU_POSTGRESQL_BRONZE_URL` point at DIFFERENT databases.** The current addon is attached as the legacy `HEROKU_POSTGRESQL_BRONZE` alias (set during Jan 2025 reprovisioning); `DATABASE_URL` is a stale manual config var pointing at a decommissioned host. **The current real DB on staging is `HEROKU_POSTGRESQL_BRONZE_URL`.** If you need to re-derive `POSTGRES_DB_*` vars on staging, parse them from `HEROKU_POSTGRESQL_BRONZE_URL`, NOT from `DATABASE_URL`. Prod uses the standard `DATABASE` alias and doesn't have this problem.
- **`POSTGRES_DB_*` vars are hand-populated and can drift from the real addon.** Any DB addon change (plan upgrade, rotation, fork, reprovisioning) updates the addon's URL but leaves the manually-set `POSTGRES_DB_*` pointing at the old DB. Symptom: `connect ETIMEDOUT` on whatever IP the stale host resolves to. Re-derive from the current addon URL (`DATABASE_URL` on prod, `HEROKU_POSTGRESQL_BRONZE_URL` on staging) after any addon change.
- **Staging config vars diverge from prod.** Staging uses a placeholder `DISCORD_WEBHOOK` (no real Discord posts), and `NEXT_PUBLIC_GOOGLE_ANALYTICS` is unset. "Works in staging" doesn't fully predict prod for these features.
- **AWS keys (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) are not set in prod or staging.** The contributor inquiry form's S3 upload is silently broken in production. `app.json` marks them `required: false` to match reality; don't add them to satisfy a feature without checking that S3 is actually expected to work.
- **`API_V1_URL` self-references the app's own hostname.** Required env var, must be set after app creation to `https://<app-domain>/api/v1`. Bootstrapping a fresh app from `app.json` cannot auto-populate this. Be careful: at one point staging's `API_V1_URL` pointed at the prod URL - meaning the staging frontend was reading from the prod DB through prod's API. Always confirm `heroku config:get API_V1_URL -a setlife-solutions-staging` matches the staging domain after any change.
- **`API_V1_URL` (and the other `next.config.js` `env` vars) are INLINED into the client bundle at BUILD time, not read at runtime.** Two consequences: (1) `pipelines:promote` is unsafe for prod — it copies staging's slug without rebuilding, so prod ends up calling staging's API/DB; deploy prod by building on it (`git push heroku-prod master`). (2) To preview prod data on a local production build you must set the var at **build** time, not just at `npm start`: `API_V1_URL="https://www.setlife.solutions/api/v1" npm run build` then start — otherwise the bundle keeps whatever was in `.env` (e.g. `localhost:3000`) and the browser CORS-fails.
- **No CI, no test suite besides the Playwright visual diff.** All other correctness verification is manual. The visual suite **hides** (display:none) genuinely random regions like the shuffled `.ProjectSimilarWork` section rather than paint-masking them — masking keeps the element's box, so a variable-height random region still shifts the layout below it and trips a dimension mismatch. Don't revert that to masking.
