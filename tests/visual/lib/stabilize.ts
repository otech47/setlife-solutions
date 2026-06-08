import { Page } from '@playwright/test'

/**
 * Scroll the full document in steps to trigger any lazy-loaded images, then
 * return to the top. Without this, a long marketing page can screenshot with
 * below-the-fold images still blank.
 */
async function autoScroll(page: Page): Promise<void> {
    await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
            let total = 0
            const step = 400
            const timer = setInterval(() => {
                window.scrollBy(0, step)
                total += step
                if (total >= document.body.scrollHeight) {
                    clearInterval(timer)
                    resolve()
                }
            }, 50)
        })
    })
    await page.evaluate(() => window.scrollTo(0, 0))
}

/**
 * Navigate to `url`, neutralize sources of rendering nondeterminism
 * (animations, transitions, blinking caret, smooth scroll), wait for fonts and
 * images to settle, and return a full-page PNG screenshot.
 *
 * The same Page (and therefore the same viewport, browser, and font set) is
 * reused for both environments by the caller, so the only intended variable
 * between the two screenshots is the deployed front-end itself.
 */
export async function capture(page: Page, url: string, hide: string[] = []): Promise<Buffer> {
    await page.goto(url, { waitUntil: 'networkidle' })

    await page.addStyleTag({
        content: `
            *, *::before, *::after {
                animation-duration: 0s !important;
                animation-delay: 0s !important;
                transition-duration: 0s !important;
                transition-delay: 0s !important;
                caret-color: transparent !important;
            }
            html { scroll-behavior: auto !important; }
        `,
    })

    // Remove genuinely non-deterministic regions from layout entirely (not just
    // paint over them): a masked box still occupies space, so a region whose
    // *height* varies between loads (e.g. a shuffled set of cards with
    // different-length text) would still shift everything below it and trip a
    // dimension mismatch. display:none equalizes both layout and content.
    if (hide.length) {
        await page.addStyleTag({
            content: hide.map((selector) => `${selector} { display: none !important; }`).join('\n'),
        })
    }

    // Fonts must be ready or text reflows/anti-aliases differently mid-shot.
    await page.evaluate(() => document.fonts.ready)

    await autoScroll(page)

    // Wait for every <img> to finish loading (or error) so nothing pops in.
    await page.evaluate(async () => {
        const imgs = Array.from(document.images)
        await Promise.all(
            imgs.map((img) =>
                img.complete && img.naturalWidth > 0
                    ? Promise.resolve()
                    : new Promise<void>((res) => {
                          img.addEventListener('load', () => res(), { once: true })
                          img.addEventListener('error', () => res(), { once: true })
                      })
            )
        )
    })

    // Small settle for any layout shift after images resolve.
    await page.waitForTimeout(400)

    return page.screenshot({
        fullPage: true,
        animations: 'disabled',
    })
}
