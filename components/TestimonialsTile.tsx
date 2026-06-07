import React from 'react'
import { useRouter } from 'next/router'

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
    const router = useRouter()

    return (
        <div
            className='TestimonialsTile flex flex-col justify-center items-center gap-5 rounded-2xl border border-primary p-8 bg-solid-white max-w-md w-max h-full'
        >
            {person_image_url && (
                <div
                    className='rounded-full bg-contain bg-no-repeat bg-center h-20 w-20'
                    style={{ backgroundImage: `url(${person_image_url})` }}
                />
            )}
            <div className='flex items-center gap-3'>
                {project.logo_image_url && (
                    <div
                        className='rounded-full bg-contain h-9 w-9 bg-no-repeat bg-center bg-black'
                        style={{ backgroundImage: `url(${project.logo_image_url})` }}
                    />
                )}
                <Subtitle variant='s' alignment='text-center' color='solid-black'>
                    { project.name }
                </Subtitle>
            </div>
            <div className='grow'>
                <Paragraph alignment='text-center'>
                    { testimony }
                </Paragraph>
            </div>
            <div className='mt-auto'>
                <Subtitle variant='xs' alignment='text-center'>
                    { person_name }
                </Subtitle>
            </div>
        </div>
    )
}

export default TestimonialTile
