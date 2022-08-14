import React from 'react'

import Headline from '../components/Headline'
import Subtitle from '../components/Subtitle'
import Paragraph from './Paragraph'

import { LEARN_MORE } from '../constants/strings'

interface ProjectProps {
    id: number,
    clientName: string,
    description: string,
    image: String,
    name: string
}

const ProjectTile = ({
    clientName,
    description,
    id,
    name,
    image,
}: ProjectProps) => {
    return (
        <div className='ProjectTile grid grid-rows'>
            <div>
                <Subtitle 
                    color='primary'
                    variant='xs-light'
                >
                    { clientName }
                </Subtitle>
            </div>
            <div>
                <div 
                    className='background flex items-end h-60 grid grid-rows'
                    style={{backgroundImage: `url(${image})`}}
                >
                    <div className='title-container bg-primary-alt grid grid-cols px-6 py-4'>
                        <div className=' grid grid-rows'>
                            <Headline color='solid-white' variant='l' alignment='text-left'>
                                { name }
                            </Headline>
                            <a href={`/projects/${id}`} className='mt-4'>
                                <div className='grid grid-flow-col auto-cols-max'>
                                    <div>
                                        <Paragraph>
                                            { LEARN_MORE }
                                        </Paragraph>
                                    </div>
                                    <div>
                                        <svg xmlns='http://www.w3.org/2000/svg' className='inline ml-4 mt-1 h-4 w-4 md:mt-0 md:w-6 md:h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                                            <path strokeLinecap='round' strokeLinejoin='round' d='M14 5l7 7m0 0l-7 7m7-7H3' />
                                        </svg>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-4'>
                { description }
            </div>
        </div>
    )
}

export default ProjectTile