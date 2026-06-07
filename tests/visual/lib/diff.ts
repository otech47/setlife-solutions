import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import { PIXEL_THRESHOLD } from './env'

export interface DiffResult {
    /** Fraction of compared pixels that differ (0..1). */
    diffRatio: number
    /** Absolute count of differing pixels. */
    diffPixels: number
    /** Total pixels compared (padded canvas area). */
    totalPixels: number
    /** True when the two screenshots had different dimensions. */
    dimensionMismatch: boolean
    prodDims: { width: number; height: number }
    stagingDims: { width: number; height: number }
    /** Diff visualization PNG; only produced when there is a difference. */
    diffBuffer: Buffer | null
}

/**
 * Copy `src` onto a fresh `width`x`height` white canvas at (0,0). Used to bring
 * two screenshots of differing size to a common canvas so pixelmatch can run.
 * Padding with white means any region present in one image but not the other
 * shows up as a real diff (a height/content change is a legitimate regression
 * signal, not something to silently crop away).
 */
function padTo(src: PNG, width: number, height: number): PNG {
    if (src.width === width && src.height === height) return src
    const out = new PNG({ width, height })
    out.data.fill(255) // opaque white
    PNG.bitblt(src, out, 0, 0, src.width, src.height, 0, 0)
    return out
}

/**
 * Pixel-diff two PNG screenshots. Prod is `baseline`, staging is `candidate`.
 */
export function compareScreenshots(baseline: Buffer, candidate: Buffer): DiffResult {
    const a = PNG.sync.read(baseline)
    const b = PNG.sync.read(candidate)

    const prodDims = { width: a.width, height: a.height }
    const stagingDims = { width: b.width, height: b.height }
    const dimensionMismatch = a.width !== b.width || a.height !== b.height

    const width = Math.max(a.width, b.width)
    const height = Math.max(a.height, b.height)
    const pa = padTo(a, width, height)
    const pb = padTo(b, width, height)

    const diff = new PNG({ width, height })
    const diffPixels = pixelmatch(pa.data, pb.data, diff.data, width, height, {
        threshold: PIXEL_THRESHOLD,
        // pixelmatch already skips detected anti-aliased pixels by default,
        // which keeps cross-render jitter from registering as changes.
    })

    const totalPixels = width * height
    const diffRatio = totalPixels === 0 ? 0 : diffPixels / totalPixels

    return {
        diffRatio,
        diffPixels,
        totalPixels,
        dimensionMismatch,
        prodDims,
        stagingDims,
        diffBuffer: diffPixels > 0 ? PNG.sync.write(diff) : null,
    }
}
