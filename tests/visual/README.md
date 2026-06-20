# Visual regression: staging vs prod

Cross-environment pixel diff. For every route, the suite renders **prod** and
**staging** in the same headless Chromium (desktop + mobile viewports), takes
stabilized full-page screenshots, and asserts staging matches prod within a
tolerance. **Prod is the model**; staging is the candidate.

This is the gate to run before deploying prod: zero diff means the pending
deploy is backend/data-only and visually safe; any diff is either an intended
change to eyeball in the report or a regression to block.

> **Deploy model:** prod is shipped by **building on prod**
> (`git push heroku-prod master`), **NOT** `heroku pipelines:promote`. Promotion
> copies staging's slug — which has staging's `API_V1_URL` inlined at build time —
> to prod and points it at the staging DB. See `CLAUDE.md` for the full runbook.

Read-only. It navigates and screenshots; it never submits forms or writes data.

## Prerequisites

- `npm install` (adds `@playwright/test`, `pixelmatch`, `pngjs`).
- `npx playwright install chromium` (one-time browser download).
- **Staging must be running.** It is normally scaled to 0 to save billing:

  ```bash
  heroku ps:scale web=1 -a setlife-solutions-staging   # ON  before the run
  # ...run the suite...
  heroku ps:scale web=0 -a setlife-solutions-staging   # OFF when done
  ```

  Wait ~15s after staging boots before running (cold-start race - first request
  can hit the resolver before the DB connection is ready).

## Run

```bash
npm run test:visual            # regenerate dynamic routes from prod, then diff
npm run test:visual:report     # open the HTML report (prod/staging/diff images)
npm run test:visual:routes     # just refresh routes.generated.json
```

Narrow the run with standard Playwright flags:

```bash
npx playwright test --project=desktop          # desktop only
npx playwright test -g "home"                  # one route by name
npx playwright test --headed                   # watch it drive the browser
```

## What it covers

- Static pages: home, services, service-packages, projects, consultation
  (+ thanks), contributor-inquiry (+ thanks).
- Detail pages: `/projects/:id` and `/services/:id` for every project/service
  that exists in prod. IDs are enumerated from prod's GraphQL by
  `generate-routes.mjs` and written to `routes.generated.json` (git-ignored,
  regenerated each run). Staging is a data replica, so the same IDs resolve.

## Tuning (env vars)

| Var | Default | Meaning |
|---|---|---|
| `PROD_BASE_URL` | `https://www.setlife.solutions` | The model. |
| `STAGING_BASE_URL` | `https://staging.setlife.solutions` | The candidate. |
| `PROD_API_URL` | `<PROD_BASE_URL>/api/v1` | GraphQL used to enumerate detail pages. |
| `MAX_DIFF_RATIO` | `0.001` | Max fraction of pixels allowed to differ (0 = strict). |
| `PIXEL_THRESHOLD` | `0.1` | Per-pixel color sensitivity (0 strict .. 1 loose). |
| `PW_WORKERS` | `3` | Parallel workers. |
| `PW_RETRIES` | `1` | Retries (absorbs cold-start/network flake). |
| `ALLOW_SAME_BASE` | unset | Allow a self-comparison smoke test when both base URLs match. |

## Interpreting failures

A failing test attaches three images to the HTML report: `prod`, `staging`, and
`diff` (differing pixels highlighted). A `DIMENSION MISMATCH` note means the two
pages rendered at different heights/widths - usually a missing or extra element,
which is the strongest regression signal.

If the difference is intended (you deliberately changed the UI on the branch
that built the staging slug), that is expected: review it, then ship the deploy
by building on prod (`git push heroku-prod master` — see `CLAUDE.md`). The
suite's job is to make sure no *unintended* visual change slips through.

## Smoke test without staging

To prove the harness works without bringing staging up, point both bases at
prod - every route should report ~0% diff:

```bash
STAGING_BASE_URL=https://www.setlife.solutions ALLOW_SAME_BASE=1 npm run test:visual
```
