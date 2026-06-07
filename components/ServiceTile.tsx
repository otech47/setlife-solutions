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
            className='ServiceTile flex flex-col gap-4 rounded-2xl p-6 bg-solid-white h-full w-full shadow-sm transition-shadow duration-200 hover:shadow-lg cursor-pointer'
            onClick={() => {
                router.push(url)
            }}
        >
            <div className='mt-2'>
                {imageUrl
                    ? (
                        <div
                            className='rounded-full bg-cover bg-center h-24 w-24 m-auto'
                            style={{ backgroundImage: `url(${imageUrl})` }}
                        />
                    ) : (
                        <div className='rounded-full bg-primary h-24 w-24 m-auto' />
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
            <div className='text-right mt-auto'>
                <a href={url}>
                    <Paragraph variant='sm' alignment='text-right' color='primary'>
                        { LEARN_MORE }
                    </Paragraph>
                </a>
            </div>
        </div>
    )
}

export default ServiceTile