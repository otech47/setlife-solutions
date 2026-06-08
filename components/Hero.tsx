import React from 'react'

import Button from './Button'
import Headline from './Headline'
import Paragraph from './Paragraph'

import {
    MAKE_SOFTWARE,
    YOUR_SUPERPOWER,
    RATHER_THAN_DELIVERING_A_BLACKBOX,
    SCHEDULE_CONSULTATION,
    CONSULTATION,
    SOFTWARE_SOLUTIONS_ENGINEERING
} from '../constants/strings'

import {
    HERO_IMAGE_URL
} from '../constants'

const Hero = ({}) => {
    return (
        <div className='Hero relative grid grid-cols-1 md:grid-cols-2 items-center'>
            {/* Soft teal glow built from the brand hue, sitting behind the content. */}
            <div
                aria-hidden='true'
                className='pointer-events-none absolute inset-0 -top-24 bg-hero-glow'
            />
            <div className='relative z-10 grid grid-flow-row auto-rows-max px-2 lg:px-4 place-content-center gap-8 md:gap-10 animate-fade-up'>
                <div className='flex justify-center md:justify-start'>
                    <span className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-tint px-4 py-1.5 text-sm font-medium tracking-tight text-primary-dark'>
                        <span className='h-2 w-2 rounded-full bg-primary' />
                        { SOFTWARE_SOLUTIONS_ENGINEERING }
                    </span>
                </div>
                <div className=''>
                    <Headline variant='xl' color='solid-black' alignment='text-center md:text-left'>
                        { MAKE_SOFTWARE }
                    </Headline>
                    <Headline variant='xl' color='primary' alignment='text-center md:text-left'>
                        { YOUR_SUPERPOWER }
                    </Headline>
                </div>
                <div className='max-w-xl'>
                    <Paragraph alignment='text-center md:text-left'>
                        { RATHER_THAN_DELIVERING_A_BLACKBOX }
                    </Paragraph>
                </div>
                <div className='text-center md:text-left'>
                    <Button variant='tertiary' link={CONSULTATION.toLowerCase()} className='px-10'>
                        {SCHEDULE_CONSULTATION.toUpperCase()}
                    </Button>
                </div>
            </div>
            <div className='relative z-10 hidden md:grid grid-cols-1 px-2 lg:px-4 max-w-md md:max-w-lg mt-12 md:mt-0 m-auto h-full place-items-center animate-fade-up-slow'>
                <img src={HERO_IMAGE_URL} alt='Hero' />
            </div>
        </div>
    )
}

export default Hero
