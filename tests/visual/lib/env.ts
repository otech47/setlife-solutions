/**
 * Central config for the visual-diff suite. Everything is env-overridable so
 * the same suite can target other hosts (a feature branch, localhost, etc.)
 * without code changes.
 */

const stripSlash = (u: string) => u.replace(/\/+$/, '')

// Prod is the model (baseline). Staging is the candidate compared against it.
export const PROD_BASE = stripSlash(process.env.PROD_BASE_URL || 'https://www.setlife.solutions')
export const STAGING_BASE = stripSlash(process.env.STAGING_BASE_URL || 'https://staging.setlife.solutions')

// Prod GraphQL endpoint used to enumerate project/service detail-page IDs.
export const PROD_API = stripSlash(process.env.PROD_API_URL || `${PROD_BASE}/api/v1`)

// Fraction of pixels allowed to differ before a route is considered changed.
// Identical content rendered in the same browser should be ~0; a small floor
// absorbs rare sub-pixel anti-alias jitter. Set MAX_DIFF_RATIO=0 for strict.
export const MAX_DIFF_RATIO = Number(process.env.MAX_DIFF_RATIO ?? '0.001')

// pixelmatch per-pixel color sensitivity (0 strict .. 1 loose).
export const PIXEL_THRESHOLD = Number(process.env.PIXEL_THRESHOLD ?? '0.1')
