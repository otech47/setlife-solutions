import React from 'react';

import LearnMoreProps from '../interfaces/LearnMoreProps';
import Headline from './Headline'

const LearnMore = ({
    text,
    url,
    newTab,
    color
}: LearnMoreProps) => {

    return (
        <div className=''>
            <a
                href={url}
                className={`group inline-flex items-center text-${color}`}
                rel={newTab ? 'noopener noreferrer' : ''}
                target={newTab ? '_blank' : ''}
            >
                <div className='self-center'>
                    <Headline variant='alternative' color={color}>
                        { text }
                    </Headline>
                </div>
                <div className='self-center'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='inline ml-4 h-4 mb-1 w-4 md:mt-0 md:w-6 md:h-6 md:mb-0 transition-transform duration-200 group-hover:translate-x-1' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M14 5l7 7m0 0l-7 7m7-7H3' />
                    </svg>
                </div>
            </a>
        </div>
    )
}

LearnMore.defaultProps = {
    newTab: false,
    color: 'solid-black'
}

export default LearnMore