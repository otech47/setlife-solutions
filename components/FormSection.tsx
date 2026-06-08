import { useState } from 'react'

import ChevronIcon from './ChevronIcon'
import Section from './Section'
import Subtitle from './Subtitle'

import { OPTIONAL } from '../constants/strings'

interface FormSectionProps {
    title: string,
    children: any,
    step?: number,
    complete?: boolean,
    optional?: boolean,
    defaultOpen?: boolean,
    isOpen?: boolean,
    onToggle?: ((next: boolean) => void) | null
}

const FormSection = ({
    title,
    children,
    step,
    complete,
    optional,
    defaultOpen,
    isOpen,
    onToggle
}: FormSectionProps) => {

    // Supports both uncontrolled (its own state) and controlled (parent passes
    // isOpen + onToggle) use, so a page-level CTA can open a specific section.
    const [internalOpen, setInternalOpen] = useState(Boolean(defaultOpen))
    const open = isOpen !== undefined ? isOpen : internalOpen

    const toggle = () => {
        const next = !open
        if (onToggle) onToggle(next)
        if (isOpen === undefined) setInternalOpen(next)
    }

    const contentId = `form-section-${title.replace(/\s+/g, '-').toLowerCase()}`

    // Badge: a check once the section is valid, otherwise its step number.
    // Colour tracks state so users can see at a glance what's done vs. open.
    let badgeClasses = 'bg-solid-white text-solid-black border-gray-200'
    if (complete) {
        badgeClasses = 'bg-primary text-solid-white border-transparent'
    } else if (open) {
        badgeClasses = 'bg-solid-black text-solid-white border-transparent'
    }

    return (
        <div className='FormSection'>
            <button
                className={`accordion w-full text-left ${open ? 'active' : ''}`}
                type='button'
                aria-expanded={open}
                aria-controls={contentId}
                onClick={toggle}
            >
                <Section color='light-gray' paddingTop='pt-5' paddingBottom='pb-5'>
                    <div className='flex items-center gap-4'>
                        {step != null && (
                            <span className={`grid place-items-center h-9 w-9 shrink-0 rounded-full border text-sm font-semibold transition-colors duration-200 ${badgeClasses}`}>
                                {complete
                                    ? (
                                        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                                            <path fillRule='evenodd' d='M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z' clipRule='evenodd' />
                                        </svg>
                                    )
                                    : step}
                            </span>
                        )}
                        <div className='flex-1 min-w-0'>
                            <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
                                <Subtitle variant='s'>
                                    { title }
                                </Subtitle>
                                {optional && (
                                    <span className='rounded-full bg-solid-black/5 px-2.5 py-0.5 text-xs font-medium tracking-tight text-gray-500'>
                                        { OPTIONAL }
                                    </span>
                                )}
                            </div>
                            <div className='mt-2 h-1 w-12 rounded-full bg-teal-gradient' />
                        </div>
                        <ChevronIcon className={`icon ${open ? 'rotate' : ''}`} width={10} fill='#777' />
                    </div>
                </Section>
            </button>
            <Section paddingBottom='' paddingTop=''>
                <div
                    id={contentId}
                    className={`content-grid grid transition-[grid-template-rows] duration-500 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                    <div className='overflow-hidden'>
                        <div className='py-12'>
                            { children }
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    )
}

FormSection.defaultProps = {
    step: null,
    complete: false,
    optional: false,
    defaultOpen: false,
    isOpen: undefined,
    onToggle: null
}

export default FormSection
