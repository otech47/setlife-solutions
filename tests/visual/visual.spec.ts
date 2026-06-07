import { test, expect } from '@playwright/test'
import { capture } from './lib/stabilize'
import { compareScreenshots } from './lib/diff'
import { getRoutes } from './lib/routes'
import { masksForPath } from './lib/masks'
import { PROD_BASE, STAGING_BASE, MAX_DIFF_RATIO } from './lib/env'

/**
 * Cross-environment visual regression: for every route, render prod and staging
 * in the same browser/viewport and assert staging matches prod within
 * MAX_DIFF_RATIO. Prod is the model; any difference is either an intended change
 * to review in the HTML report or a regression to block before promoting.
 *
 * Read-only: we navigate and screenshot only. No forms are submitted.
 */
const routes = getRoutes()

test.describe(`visual parity: staging vs prod`, () => {
    test.skip(
        PROD_BASE === STAGING_BASE && !process.env.ALLOW_SAME_BASE,
        'PROD_BASE_URL and STAGING_BASE_URL are identical - set ALLOW_SAME_BASE=1 to run a self-comparison smoke test.'
    )

    for (const route of routes) {
        test(`${route.name} [${route.path}]`, async ({ page }, testInfo) => {
            const prodUrl = `${PROD_BASE}${route.path}`
            const stagingUrl = `${STAGING_BASE}${route.path}`
            const masks = masksForPath(route.path)

            // Capture prod first (the model), then staging, on the same page.
            const prodShot = await capture(page, prodUrl, masks)
            const stagingShot = await capture(page, stagingUrl, masks)

            const result = compareScreenshots(prodShot, stagingShot)

            await testInfo.attach('prod', { body: prodShot, contentType: 'image/png' })
            await testInfo.attach('staging', { body: stagingShot, contentType: 'image/png' })
            if (result.diffBuffer) {
                await testInfo.attach('diff', { body: result.diffBuffer, contentType: 'image/png' })
            }

            const pct = (result.diffRatio * 100).toFixed(3)
            const dims = result.dimensionMismatch
                ? ` DIMENSION MISMATCH prod=${result.prodDims.width}x${result.prodDims.height} staging=${result.stagingDims.width}x${result.stagingDims.height}.`
                : ''
            const message =
                `${route.path}: staging differs from prod by ${pct}% ` +
                `(${result.diffPixels}/${result.totalPixels} px, allowed ${(MAX_DIFF_RATIO * 100).toFixed(3)}%).${dims}\n` +
                `prod=${prodUrl}\nstaging=${stagingUrl}\n` +
                `See attached prod/staging/diff images in the HTML report (npm run test:visual:report).`

            expect(result.diffRatio, message).toBeLessThanOrEqual(MAX_DIFF_RATIO)
        })
    }
})
