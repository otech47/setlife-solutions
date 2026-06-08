import { useEffect, useState } from 'react'

import Paragraph from './Paragraph'
import OptionChip from './OptionChip'

import {
    SOFTWARE_CONSULTING,
    PROJECT_MANAGEMENT,
    PRODUCT_DESIGN,
    SOFTWARE_IMPLEMENTATION,
    APPLICATION_MAINTENANCE,
    WHICH_SERVICE_BEST_FITS,
    GIVE_US_BRIEF_DESCRIPTION,
    PLEASE_GIVE_A_DESCRIPTION,
    UNDECIDED,
} from '../constants/strings'

interface ProjectGoalsFormProps {
    setServiceInformation: any,
    setServiceInformationError: any
    setServices: any
}

const ProjectGoalsForm = ({
    setServiceInformation,
    setServices,
    setServiceInformationError
}: ProjectGoalsFormProps) => {

    const [serviceTypes, setServiceTypes] = useState<string[]>([])
    const [projectGoal, setProjectGoal] = useState('')
    const [serviceTypeError, setServiceTypeError] = useState(false)
    const [projectGoalError, setProjectGoalError] = useState(false)

    useEffect(() => {
        setServiceInformation({ projectGoal })
    }, [projectGoal])
    
    useEffect(() => {
        setServices(serviceTypes)
        setServiceTypeError(!serviceTypes.length)
    }, [serviceTypes])

    useEffect(() => {
        if (!serviceTypeError && !projectGoalError && projectGoal) {
            setServiceInformationError(false)
        } else {
            setServiceInformationError(true)
        }
    }, [serviceTypeError, projectGoalError, projectGoal])

    const addServiceType = (service: string) => {
        if (serviceTypes.includes(service)) {
            setServiceTypes(
                serviceTypes.filter((value: string) => value != service)
            )
            return
        }
        setServiceTypes([...serviceTypes, service])
    }

    const onChangeProjectGoal = (value: string) => {
        setProjectGoal(value)
        setProjectGoalError(value
            ? false
            : true
        )
    }

    const renderServiceTypes = () => {
        const services = [
            {
                name: SOFTWARE_CONSULTING,
            },
            {
                name: PROJECT_MANAGEMENT
            },
            {
                name: PRODUCT_DESIGN
            },
            {
                name: SOFTWARE_IMPLEMENTATION
            },
            {
                name: APPLICATION_MAINTENANCE
            },
            {
                name: UNDECIDED
            },
        ]
        return services.map(service => (
            <OptionChip
                key={service.name}
                label={service.name}
                selected={serviceTypes.includes(service.name)}
                onSelect={() => addServiceType(service.name)}
            />
        ))
    }

    return (
        <div className='ProjectGoalsForm'>
            <div className='grid grid-flow-row auto-rows-max gap-8 w-full md:w-8/12'>
                <Paragraph variant='m-bold'>
                    {WHICH_SERVICE_BEST_FITS + '*'}
                </Paragraph>
                <div className='flex flex-wrap gap-3'>
                    { renderServiceTypes() }
                </div>
                <Paragraph variant='m-bold'>
                    {GIVE_US_BRIEF_DESCRIPTION + '*'}
                </Paragraph>
                <textarea
                    className={`
                        form-control
                        block
                        w-full
                        px-4
                        py-3
                        text-sm
                        bg-white
                        bg-clip-padding
                        border
                        ${projectGoalError ? 'border-red-500' : 'border-gray-200 focus:border-primary'}
                        rounded-xl
                        m-0
                        transition-colors
                    `}
                    id='formControlTextarea'
                    rows={8}
                    placeholder={GIVE_US_BRIEF_DESCRIPTION}
                    onChange={(e) => onChangeProjectGoal(e.target.value)}
                />
                {projectGoalError && (
                    <span className='px-5 text-sm text-red-500'>
                        { PLEASE_GIVE_A_DESCRIPTION }
                    </span>
                )}
            </div>
        </div>
    )
}

export default ProjectGoalsForm