import fs from 'fs'
import path from 'path'

export interface Route {
    name: string
    path: string
}

/**
 * Static marketing pages. These are reachable by direct navigation and carry
 * no write side effects, so they are safe to screenshot. The two `/thanks`
 * pages are post-submit confirmation screens but render standalone.
 */
export const STATIC_ROUTES: Route[] = [
    { name: 'home', path: '/' },
    { name: 'services', path: '/services' },
    { name: 'service-packages', path: '/service-packages' },
    { name: 'projects', path: '/projects' },
    { name: 'consultation', path: '/consultation' },
    { name: 'consultation-thanks', path: '/consultation/thanks' },
    { name: 'contributor-inquiry', path: '/contributor-inquiry' },
    { name: 'contributor-inquiry-thanks', path: '/contributor-inquiry/thanks' },
]

const GENERATED = path.join(__dirname, '..', 'routes.generated.json')

/**
 * Full route list = static pages + dynamic detail pages.
 *
 * Dynamic routes (/projects/:id, /services/:id) are written to
 * routes.generated.json by generate-routes.mjs, which enumerates real IDs from
 * prod's GraphQL. Staging is a data replica of prod, so the same IDs resolve on
 * both. If the file is absent (generator not run / prod unreachable) we fall
 * back to static routes only and warn.
 */
export function getRoutes(): Route[] {
    let dynamic: Route[] = []
    if (fs.existsSync(GENERATED)) {
        try {
            dynamic = JSON.parse(fs.readFileSync(GENERATED, 'utf8'))
        } catch (e) {
            console.warn(`[visual] could not parse ${GENERATED}: ${(e as Error).message}`)
        }
    } else {
        console.warn('[visual] routes.generated.json not found - run `npm run test:visual:routes` to include detail pages. Testing static routes only.')
    }
    return [...STATIC_ROUTES, ...dynamic]
}
