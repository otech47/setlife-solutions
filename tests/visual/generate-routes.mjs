#!/usr/bin/env node
/**
 * Enumerate dynamic detail-page routes (/projects/:id, /services/:id) by
 * querying prod's GraphQL API, and write them to routes.generated.json next to
 * this file. The visual suite reads that file to build its full route list.
 *
 * Prod is the source of truth for which IDs exist; staging is a data replica,
 * so the same IDs resolve there too.
 *
 * Failure to reach prod is non-fatal: we exit 0 so the suite can still run the
 * static routes. Env overrides: PROD_BASE_URL, PROD_API_URL.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const stripSlash = (u) => u.replace(/\/+$/, '')
const PROD = stripSlash(process.env.PROD_BASE_URL || 'https://www.setlife.solutions')
const API = stripSlash(process.env.PROD_API_URL || `${PROD}/api/v1`)
const target = path.join(here, 'routes.generated.json')

async function gql(query) {
    const res = await fetch(API, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${API}`)
    const json = await res.json()
    if (json.errors) throw new Error(JSON.stringify(json.errors))
    return json.data
}

const slug = (s, id) => String(s || id).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)

try {
    const routes = []

    const { fetchProjects } = await gql('{ fetchProjects { id name } }')
    for (const p of fetchProjects || []) {
        routes.push({ name: `project-${slug(p.name, p.id)}`, path: `/projects/${p.id}` })
    }

    const { fetchServices } = await gql('{ fetchServices { id name } }')
    for (const s of fetchServices || []) {
        routes.push({ name: `service-${slug(s.name, s.id)}`, path: `/services/${s.id}` })
    }

    fs.writeFileSync(target, `${JSON.stringify(routes, null, 2)}\n`)
    console.log(`[visual] wrote ${routes.length} dynamic routes to ${path.relative(process.cwd(), target)} (from ${API})`)
} catch (e) {
    console.error(`[visual] could not enumerate dynamic routes from ${API}: ${e.message}`)
    console.error('[visual] static routes will still run. Detail pages skipped this run.')
    process.exit(0)
}
