import React from 'react'

interface OptionChipProps {
    label: string,
    selected: boolean,
    onSelect: () => void
}

// A selectable pill used for the consultation form's radio/checkbox groups.
// Replaces tiny native radio dots with a large, obvious tap target whose
// selected state reads at a glance (filled teal + check) — better on mobile
// and clearer than a 16px circle.
const OptionChip = ({
    label,
    selected,
    onSelect
}: OptionChipProps) => {

    const stateClasses = selected
        ? 'border-primary bg-primary text-solid-white shadow-soft'
        : 'border-gray-200 bg-solid-white text-solid-black hover:border-primary hover:text-primary-dark'

    return (
        <button
            type='button'
            aria-pressed={selected}
            onClick={onSelect}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm text-left tracking-tight transition-all duration-150 ${stateClasses}`}
        >
            {selected && (
                <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 shrink-0' viewBox='0 0 20 20' fill='currentColor'>
                    <path fillRule='evenodd' d='M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z' clipRule='evenodd' />
                </svg>
            )}
            <span>{ label }</span>
        </button>
    )
}

export default OptionChip
