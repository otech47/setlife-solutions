import { defineConfig } from '@playwright/test'

/**
 * Visual-regression config: drives a headless Chromium against two LIVE
 * environments (prod + staging) and pixel-diffs the rendered pages.
 *
 * There is no local webServer here on purpose - we test deployed URLs, not a
 * local build. Prod is the source of truth; staging must match it.
 *
 * Base URLs and tolerances are env-overridable (see tests/visual/lib/env.ts).
 * Run `npm run test:visual` (which first regenerates the dynamic route list).
 */
export default defineConfig({
    testDir: './tests/visual',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    // Live sites + cold-start on staging => allow one retry to absorb flake.
    retries: Number(process.env.PW_RETRIES ?? (process.env.CI ? '1' : '1')),
    // Keep workers modest: each test hits two live environments sequentially.
    workers: Number(process.env.PW_WORKERS ?? '3'),
    reporter: [['list'], ['html', { open: 'never' }]],
    // Each test loads two full pages (prod + staging) and scrolls them.
    timeout: 120_000,
    expect: { timeout: 15_000 },
    use: {
        ignoreHTTPSErrors: true,
        // We capture screenshots manually inside the test, not via the
        // built-in failure screenshot.
        screenshot: 'off',
        trace: 'on-first-retry',
        actionTimeout: 30_000,
        navigationTimeout: 60_000,
    },
    projects: [
        {
            name: 'desktop',
            use: {
                browserName: 'chromium',
                viewport: { width: 1280, height: 800 },
                deviceScaleFactor: 1,
            },
        },
        {
            name: 'mobile',
            use: {
                browserName: 'chromium',
                viewport: { width: 390, height: 844 },
                deviceScaleFactor: 1,
                isMobile: true,
                hasTouch: true,
            },
        },
    ],
})
