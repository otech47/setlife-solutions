/**
 * Per-route masks for genuinely non-deterministic regions.
 *
 * A masked element is painted with a fixed solid color in the screenshot, so
 * its actual content cannot register as a diff. Both prod and staging get the
 * exact same mask, so the region is identical on both sides while everything
 * around it is still compared pixel-for-pixel.
 *
 * Only mask things that are intentionally random/dynamic - masking hides
 * regressions inside the masked box, so keep the list tight and justified.
 */
export function masksForPath(path: string): string[] {
    const masks: string[] = []

    // /projects/:id renders a "You may also like" section whose tiles are
    // `shuffle()`d on every load (pages/projects/[projectId].tsx). The random
    // set/order is not a regression signal, so mask the whole section.
    if (/^\/projects\/\d+\/?$/.test(path)) {
        masks.push('.ProjectSimilarWork')
    }

    return masks
}
