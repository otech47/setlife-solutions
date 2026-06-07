import React from 'react'

import Headline from './Headline'

interface PageBannerProps {
    image: string,
    title: string,
    titleAlignment?: string
}

const PageBanner = ({
    image,
    title,
    titleAlignment
}: PageBannerProps) => {

    return (
        <div
            className='PageBanner flex flex-col justify-end h-80 md:h-96 bg-cover bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${image})` }}
        >
            <div className='title-container bg-primary-alt px-8 md:px-24 xl:px-48 py-8'>
                <Headline color='solid-white' variant='xl' alignment={titleAlignment}>
                    { title }
                </Headline>
            </div>
        </div>
    )
}

PageBanner.defaultProps = {
    titleAlignment: 'left'
}

export default PageBanner