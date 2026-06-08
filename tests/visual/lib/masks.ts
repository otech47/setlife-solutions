/**
 * Per-route selectors for genuinely non-deterministic regions to HIDE during
 * capture (display:none), on both prod and staging identically.
 *
 * We hide rather than paint-mask because these regions vary in *height*, not
 * just content - a paint mask keeps the element's box, so a taller random
 * variant would still push the footer down and trip a dimension mismatch.
 * Removing it from layout makes the rest of the page line up exactly.
 *
 * Keep this list tight: a hidden region is no longer compared at all, so only
 * hide things that are intentionally random AND whose styling is covered
 * elsewhere.
 */
export function hiddenSelectorsForPath(path: string): string[] {
    const hide: string[] = []

    // /projects/:id renders a "You may also like" section whose tiles are
    // `shuffle()`d on every load (pages/projects/[projectId].tsx) and now show
    // full-length descriptions, so the section's height varies per load. The
    // tiles use ProjectTile, which is already compared in full on /projects.
    if (/^\/projects\/\d+\/?$/.test(path)) {
        hide.push('.ProjectSimilarWork')
    }

    return hide
}
