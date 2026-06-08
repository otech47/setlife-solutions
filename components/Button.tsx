import React from 'react'

interface ButtonProps {
    children: any,
    className?: string,
    link?: string | null,
    variant?: string,
    disabled?: boolean
}

const variants = {
    'primary': {
        'background': 'bg-light-gray',
        'border': 'border-2 border-light-gray',
        'color': 'text-primary'
    },
    'secondary': {
        'background': 'bg-solid-white',
        'border': 'border-2 border-primary',
        'color': 'text-primary'
    },
    'tertiary': {
        'background': 'bg-primary',
        'border': '',
        'color': 'text-solid-white'
    },
    'dark': {
        'background': 'bg-solid-black',
        'border': '',
        'color': 'text-solid-white'
    }
}

const Button = ({
    children,
    link,
    variant,
    disabled,
    className
}: ButtonProps) => {

    const styleProps = variants[(variant || 'primary') as keyof typeof variants];

    // inline-flex + center keeps the label centered and sizes the button to its
    // content in normal flow; callers can still force width with `w-full`.
    const classes = `
        Button
        inline-flex items-center justify-center text-center
        rounded-full py-4 px-8
        font-medium
        transition-opacity duration-200
        ${disabled ? 'bg-light-gray cursor-not-allowed' : `${styleProps.background} hover:opacity-90`}
        ${styleProps.border}
        ${styleProps.color}
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
        <button className={classes} type='button' disabled={disabled}>
            {children}
        </button>
    )
}

Button.defaultProps = {
    variant: 'primary',
    link: null,
    disabled: false,
    className: ''
}

export default Button
