import React from 'react'

import Headline from '../components/Headline'
import Subtitle from '../components/Subtitle'
import Paragraph from '../components/Paragraph'

import ServicePackageProps from '../interfaces/ServicePackageProps'

import {
    ESTIMATED_COST,
    MINIMUM_COST,
    THIS_PACKAGE_CAN_BE_SCALED_UP
} from '../constants/strings'
import CheckTile from './CheckTile'

interface ServicePackageTileProps {
    servicePackage: ServicePackageProps,
    idx: number | null
}

const ServicePackageTile = ({
    servicePackage, 
    idx = null
}: ServicePackageTileProps) => {

    const {
        id,
        name,
        description,
        additional_notice,
        meeting_frequency,
        estimated_cost,
        minimum_cost
    } = servicePackage

    return (
        <div
            className='ServicePackageTile flex flex-col h-full bg-solid-white p-8 rounded-lg gap-6'
            key={id}
        >
            <div
                className='container rounded-full bg-primary h-24 w-24 mx-auto'
            >
                {idx && (
                    <div className='package-number m-auto'>
                        <Headline color='solid-white' alignment='text-center'>
                            {`${idx}`}
                        </Headline>
                    </div>
                )}
            </div>
            <Subtitle variant='s' alignment='text-center'>
                { name }
            </Subtitle>
            <Paragraph>
                { description }
            </Paragraph>
            {additional_notice && (
                <div className='flex items-start gap-3'>
                    <div className='shrink-0 mt-1'>
                        <CheckTile />
                    </div>
                    <Paragraph>
                        { additional_notice }
                    </Paragraph>
                </div>
            )}
            <div className='mt-auto flex flex-col gap-3 pt-2'>
                <Paragraph alignment='text-center' color='primary'>
                    { meeting_frequency }
                </Paragraph>
                {estimated_cost && (
                    <>
                        <Paragraph alignment='text-center' color='primary'>
                            { ESTIMATED_COST }
                        </Paragraph>
                        <Paragraph alignment='text-center' color='primary' variant='m-bold'>
                            { estimated_cost }
                        </Paragraph>
                    </>
                )}
                {minimum_cost && (
                    <>
                        <Paragraph alignment='text-center' color='primary'>
                            { MINIMUM_COST }
                        </Paragraph>
                        <Paragraph alignment='text-center' color='primary' variant='m-bold'>
                            { minimum_cost }
                        </Paragraph>
                        <Paragraph alignment='text-center' color='red-600'>
                            { THIS_PACKAGE_CAN_BE_SCALED_UP }
                        </Paragraph>
                    </>
                )}
            </div>
        </div>
    )
}

export default ServicePackageTile