# Setlife-solutions

## Development

### Overview

Created with NextJS combines both backend and framework into a single app. React based for the fronted communicating with the back making use of a GraphQL API.

### Project Structure

- `pages/` — Next.js routes (pages router): React pages, plus the API routes under `pages/api/`.
- `pages/api/v1.ts` — the GraphQL endpoint (apollo-server-micro); the schema is assembled under `pages/api/graphql/schema/`.
- `pages/api/models/` + `pages/api/migrations/` — Sequelize models and DB migrations (Postgres).
- `components/` — reusable React components (flat; no per-component folders).
- `interfaces/` — TypeScript prop interfaces split out of components.
- `operations/` — client-side GraphQL queries/mutations as `gql` literals.
- `constants/strings.ts` — static copy as named exports (run `npm run order-strings` after adding).
- `config/` — app config, including DB-credential wiring.
- `styles/` — Tailwind + SCSS (entry `styles/index.scss`).
- `utilities/` — helpers (e.g. `s3.ts`).
- `tests/visual/` — Playwright visual-regression suite (staging vs prod).

> **Site content lives in the database, not in code.** Project/service copy,
> links, and images are DB rows (there are no seeders). Change them with data
> migrations, not by editing source. The canonical engineering reference —
> architecture, request flow, GraphQL schema assembly, data layer, frontend
> conventions, and the full Heroku deploy runbook — is [`CLAUDE.md`](./CLAUDE.md).
> Read it before making changes or deploying.

```
/ setlife-solutions
|_ config
|_ components
|_ styles
|_ pages
   |_ api
      |_ v1.ts
      |_ migrations
      |_ models
      |_ graphql
         |_ schema
            |_ index.ts
            |_ resolvers
            |_ types
         
```

### Setup

1. Clone the repo

```
git clone https://github.com/setlife-network/setlife-solutions.git
```

2. Install packages

```
cd setlife-solutions
npm install
```

3. Copy the sample environment configuration file

```
cp .env.example .env
```

4. Obtain a `.env` file from a project maintainer or fill out your own values

5. Run the app

```
npm run dev
```

7. UI should open in the browser at `localhost:3000`

8. An API Explorer is accessible in the browser at `localhost:3000/api/v1`

#### Using a local database

1. Download PostgreSQL v14 with the client of choice from here https://www.postgresql.org/
2. Create a database and setup the `.env` file with the corresponding credentials
3. Generate the tables running the migrations `npx sequelize-cli db:migrate`
4. Start the app `npm run dev`

> **Note:** the DB connection forces SSL (`rejectUnauthorized: false`, for hosted Postgres). Local Postgres usually doesn't accept SSL, so expect connection failures unless your local DB has SSL enabled or you temporarily relax `dialectOptions.ssl` in `config/`.

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

The GraphQL API is served from `pages/api/v1.ts` and is explorable in the browser at [http://localhost:3000/api/v1](http://localhost:3000/api/v1).

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deployment

This app deploys to **Heroku** (not Vercel), staging-first with a build-on-prod release. The full runbook — branch model, the staging→prod flow, env-var landmines (notably that `API_V1_URL` is inlined at build time, which is why prod is built directly rather than promoted), and the visual-regression gate — lives in [`CLAUDE.md`](./CLAUDE.md). Read it before deploying.
