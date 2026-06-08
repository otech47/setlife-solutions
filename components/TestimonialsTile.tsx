import React from 'react'

import Paragraph from './Paragraph'
import Subtitle from './Subtitle'

interface TestimonialsTileProps {
    person_name: string,
    testimony: string,
    person_image_url: string,
    project: {
        name: string,
        logo_image_url: string,
    }

}

const TestimonialTile = ({
    person_name,
    testimony,
    person_image_url,
    project

}: TestimonialsTileProps) => {

    return (
        <div
            className='TestimonialsTile relative flex flex-col gap-6 rounded-2xl border border-solid-black/5 shadow-card p-8 pt-10 bg-solid-white w-[19rem] md:w-[24rem] h-full transition-all duration-300 ease-out hover:shadow-card-hover hover:-translate-y-1'
        >
            <span
                aria-hidden='true'
                className='absolute top-3 left-7 select-none text-6xl leading-none font-serif text-primary/25'
            >
                &ldquo;
            </span>
            <div className='grow'>
                <Paragraph alignment='text-left'>
                    { testimony }
                </Paragraph>
            </div>
            <div className='flex items-center gap-3 pt-5 border-t border-solid-black/5'>
                {person_image_url && (
                    <div
                        className='shrink-0 rounded-full bg-cover bg-no-repeat bg-center h-12 w-12 ring-1 ring-solid-black/5'
                        style={{ backgroundImage: `url(${person_image_url})` }}
                    />
                )}
                <div className='min-w-0'>
                    <Subtitle variant='xs' alignment='text-left' color='solid-black'>
                        { person_name }
                    </Subtitle>
                    <Paragraph variant='sm' alignment='text-left' color='primary-dark'>
                        { project.name }
                    </Paragraph>
                </div>
                {project.logo_image_url && (
                    <div
                        className='ml-auto shrink-0 rounded-full bg-contain bg-no-repeat bg-center h-10 w-10 bg-black'
                        style={{ backgroundImage: `url(${project.logo_image_url})` }}
                    />
                )}
            </div>
        </div>
    )
}

export default TestimonialTile
