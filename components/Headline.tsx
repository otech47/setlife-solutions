import React from 'react'

import TextProps from '../interfaces/TextProps'

const variants = [
    {
        'xxl': {
            'weight': 'font-bold',
            'size': 'text-4xl',
            'responsive': 'md:text-6xl',
            'tracking': 'tracking-tight',
            'leading': 'leading-[1.05]'
        }
    },
    {
        'xl': {
            'weight': 'font-bold',
            'size': 'text-4xl',
            'responsive': 'md:text-5xl',
            'tracking': 'tracking-tight',
            'leading': 'leading-[1.08]'
        }
    },
    {
        'l': {
            'weight': 'font-normal',
            'size': 'text-4xl',
            'tracking': 'tracking-tight',
            'leading': 'leading-snug'
        }
    },
    {
        'h1': {
            'weight': 'font-bold',
            'size': 'text-3xl',
            'tracking': 'tracking-tight',
            'leading': 'leading-snug'
        }
    },
    {
        'h2': {
            'weight': 'font-bold',
            'size': 'text-2xl',
            'tracking': 'tracking-tight',
            'leading': 'leading-snug'
        }
    },
    {
        'h2-semibold': {
            'weight': 'font-semibold',
            'size': 'text-2xl',
            'tracking': 'tracking-tight'
        }
    },
    {
        'h2-thin': {
            'weight': 'font-thin',
            'size': 'text-2xl',
            'tracking': 'tracking-tight'
        }
    },
    {
        'alternative': {
            'weight': 'font-normal',
            'size': 'text-base',
            'responsive': 'md:text-3xl',
            'tracking': 'tracking-tight'
        }
    },
    {
        'xs': {
            'weight': 'font-normal',
            'size': 'text-xs'
        }
    }
]

const Headline = ({
    alignment,
    children,
    color,
    variant
}: TextProps) => {

    const styleProps: any = Object.values(variants.filter(v => Object.keys(v)[0] == variant)[0])[0]

    return (
        <div className={`Headline ${styleProps.weight} ${styleProps.size} text-${color} ${alignment} ${styleProps.responsive || ''} ${styleProps.tracking || ''} ${styleProps.leading || ''}`}>
            { children }
        </div>
    )
}

Headline.defaultProps = {
    alignment: 'text-left',
    color: 'solid-black',
    variant: 'l'
}

export default Headline