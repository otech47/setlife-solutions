/**
 * Build the visible label for a project's "visit site" CTA from the actual
 * destination URL, so the button text matches where it goes:
 *   https://quotanda.com      -> "QUOTANDA.COM"
 *   https://compassmining.io  -> "COMPASSMINING.IO"
 *   https://fedi.xyz          -> "FEDI.XYZ"
 *
 * Historically the label was hardcoded to `<NAME>.COM`, which was wrong for any
 * project hosted on a non-.com TLD. If the resource isn't a parseable absolute
 * URL we fall back to that old form rather than render nothing.
 */
export const resourceLabel = (resource: string, projectName: string): string => {
    try {
        return new URL(resource).hostname.replace(/^www\./, '').toUpperCase()
    } catch {
        return `${projectName.toUpperCase()}.COM`
    }
}

export default resourceLabel
