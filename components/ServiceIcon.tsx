import React from 'react'

// Uniform line icons (Lucide, MIT) rendered white inside the service tiles'
// gradient discs. Keyword-matched on the service name so they keep working if
// the DB label varies slightly (e.g. "Project Engineering Management").
// If a service ever gets a real tile_image_url, ServiceTile shows that instead.
const ICONS: { [key: string]: JSX.Element } = {
    // lightbulb — advice / consulting
    consulting: (
        <>
            <path d='M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5' />
            <path d='M9 18h6' />
            <path d='M10 22h4' />
        </>
    ),
    // clipboard-list — project / engineering management
    management: (
        <>
            <rect width='8' height='4' x='8' y='2' rx='1' ry='1' />
            <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' />
            <path d='M12 11h4' />
            <path d='M12 16h4' />
            <path d='M8 11h.01' />
            <path d='M8 16h.01' />
        </>
    ),
    // pen-tool — UI/UX design
    design: (
        <>
            <path d='M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z' />
            <path d='m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18' />
            <path d='m2.3 2.3 7.286 7.286' />
            <circle cx='11' cy='11' r='2' />
        </>
    ),
    // code — software implementation
    implementation: (
        <>
            <path d='m16 18 6-6-6-6' />
            <path d='m8 6-6 6 6 6' />
        </>
    ),
    // wrench — application maintenance
    maintenance: (
        <path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z' />
    )
}

const pickIcon = (name: string) => {
    const n = (name || '').toLowerCase()
    if (n.includes('consult')) return ICONS.consulting
    if (n.includes('manage')) return ICONS.management
    if (n.includes('design')) return ICONS.design
    if (n.includes('implement')) return ICONS.implementation
    if (n.includes('maint')) return ICONS.maintenance
    return ICONS.consulting
}

interface ServiceIconProps {
    name: string,
    className?: string
}

const ServiceIcon = ({
    name,
    className
}: ServiceIconProps) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        className={className}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.75}
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        { pickIcon(name) }
    </svg>
)

ServiceIcon.defaultProps = {
    className: ''
}

export default ServiceIcon
