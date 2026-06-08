import React from 'react'

interface ButtonProps {
    children: any,
    className?: string,
    link?: string | null,
    variant?: string,
    disabled?: boolean,
    type?: 'button' | 'submit',
    onClick?: (() => void) | null
}

const variants = {
    'primary': {
        'background': 'bg-light-gray',
        'border': 'border border-solid-black/5',
        'color': 'text-primary-dark',
        'shadow': 'shadow-soft',
        'hover': 'hover:bg-[#E9EAEB] hover:shadow-card'
    },
    'secondary': {
        'background': 'bg-solid-white',
        'border': 'border-2 border-primary',
        'color': 'text-primary-dark',
        'shadow': 'shadow-soft',
        'hover': 'hover:bg-primary-tint hover:shadow-card'
    },
    'tertiary': {
        'background': 'bg-teal-gradient',
        'border': '',
        'color': 'text-solid-white',
        'shadow': 'shadow-glow',
        'hover': 'hover:shadow-glow-lg hover:brightness-105'
    },
    'dark': {
        'background': 'bg-solid-black',
        'border': '',
        'color': 'text-solid-white',
        'shadow': 'shadow-card',
        'hover': 'hover:shadow-card-hover hover:bg-[#111]'
    }
}

const Button = ({
    children,
    link,
    variant,
    disabled,
    className,
    type,
    onClick
}: ButtonProps) => {

    const styleProps = variants[(variant || 'primary') as keyof typeof variants];

    // inline-flex + center keeps the label centered and sizes the button to its
    // content in normal flow; callers can still force width with `w-full`.
    // A subtle lift + shadow on hover gives the CTA real weight without motion noise.
    const stateClasses = disabled
        ? 'bg-light-gray text-solid-black/40 cursor-not-allowed'
        : `${styleProps.background} ${styleProps.color} ${styleProps.shadow} ${styleProps.hover} hover:-translate-y-0.5 active:translate-y-0`

    const borderClass = disabled ? '' : styleProps.border

    const classes = `
        Button
        inline-flex items-center justify-center text-center
        rounded-full py-4 px-8
        font-medium tracking-tight
        transition-all duration-200 ease-out
        ${stateClasses}
        ${borderClass}
        ${className}
    `

    if (link) {
        return (
            <a href={link} className={classes}>
                {children}
            </a>
        )
    }

    return (
        // eslint-disable-next-line react/button-has-type
        <button className={classes} type={type || 'button'} disabled={disabled} onClick={onClick || undefined}>
            {children}
        </button>
    )
}

Button.defaultProps = {
    variant: 'primary',
    link: null,
    disabled: false,
    className: '',
    type: 'button',
    onClick: null
}

export default Button
