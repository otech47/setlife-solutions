import React from 'react'
import { useRouter } from 'next/router'

import Paragraph from './Paragraph'
import Subtitle from './Subtitle'

import { LEARN_MORE } from '../constants/strings' 

interface ServiceTileProps {
    name: string,
    description: string,
    url: string,
    imageUrl: string,
}

const ServiceTile = ({
    name,
    description,
    url,
    imageUrl,
}: ServiceTileProps) => {
    const router = useRouter()

    return (
        <div
            className='ServiceTile group flex flex-col gap-5 rounded-2xl border border-solid-black/5 p-8 bg-solid-white h-full w-full shadow-card transition-all duration-300 ease-out hover:shadow-card-hover hover:-translate-y-1 cursor-pointer'
            onClick={() => {
                router.push(url)
            }}
        >
            <div className='mt-1'>
                {imageUrl
                    ? (
                        <div
                            className='rounded-2xl bg-cover bg-center h-20 w-20 mx-auto ring-1 ring-solid-black/5 shadow-soft transition-transform duration-300 group-hover:scale-105'
                            style={{ backgroundImage: `url(${imageUrl})` }}
                        />
                    ) : (
                        <div className='rounded-2xl bg-teal-gradient h-20 w-20 mx-auto shadow-glow transition-transform duration-300 group-hover:scale-105' />
                    )
                }
            </div>
            <div className=''>
                <Subtitle variant='xs' alignment='text-center'>
                    { name }
                </Subtitle>
            </div>
            <div className='grow'>
                <Paragraph alignment='text-center'>
                    { description }
                </Paragraph>
            </div>
            <div className='mt-auto flex justify-center'>
                <a href={url} className='inline-flex items-center gap-1.5 text-sm font-medium text-primary-dark transition-colors'>
                    { LEARN_MORE }
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.2}>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M14 5l7 7m0 0l-7 7m7-7H3' />
                    </svg>
                </a>
            </div>
        </div>
    )
}

export default ServiceTile