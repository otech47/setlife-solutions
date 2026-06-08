import React from 'react'

import Headline from '../components/Headline'
import Subtitle from '../components/Subtitle'
import Paragraph from './Paragraph'

import { LEARN_MORE } from '../constants/strings'

interface ProjectProps {
    id: number,
    clientName: string,
    description: string,
    image: string,
    name: string,
    externalLink: string | null,
}

const ProjectTile = ({
    clientName,
    description,
    id,
    name,
    image,
    externalLink,
}: ProjectProps) => {
    return (
        <div className='ProjectTile group flex flex-col overflow-x-hidden'>
            <div className='mb-2'>
                <Subtitle
                    color='primary-dark'
                    variant='xs-light'
                >
                    { clientName }
                </Subtitle>
            </div>
            <div className='overflow-hidden rounded-2xl shadow-card transition-all duration-300 ease-out group-hover:shadow-card-hover group-hover:-translate-y-1'>
                <div
                    className='background relative flex items-end h-60'
                    style={{ backgroundImage: `url(${image})` }}
                >
                    <div
                        aria-hidden='true'
                        className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent'
                    />
                    <div className='relative title-container w-full bg-primary-alt backdrop-blur-sm px-6 py-5'>
                        <Headline color='solid-white' variant='h1' alignment='text-left'>
                            { name }
                        </Headline>
                        <a href={externalLink ? externalLink : `/projects/${id}`} className='mt-3 inline-flex items-center gap-2 text-solid-white' target={externalLink ? `_blank` : '_self'}>
                            <Paragraph color='solid-white'>
                                { LEARN_MORE }
                            </Paragraph>
                            <svg xmlns='http://www.w3.org/2000/svg' className='inline h-4 w-4 md:w-5 md:h-5 transition-transform duration-200 group-hover:translate-x-1' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M14 5l7 7m0 0l-7 7m7-7H3' />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <div className='description mt-4 leading-relaxed'>
                { description }
            </div>
        </div>
    )
}

export default ProjectTile