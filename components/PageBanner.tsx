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
            className='PageBanner relative flex flex-col justify-end h-80 md:h-96 bg-cover bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${image})` }}
        >
            <div
                aria-hidden='true'
                className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent'
            />
            <div className='relative title-container bg-primary-alt backdrop-blur-sm border-t border-solid-white/10 px-8 md:px-24 xl:px-48 py-8 md:py-10'>
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