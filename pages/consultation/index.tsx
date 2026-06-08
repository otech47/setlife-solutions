import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'

import sendMessage from '../api/webhooks/discord'

import BudgetTimelineForm from '../../components/BudgetTimelineForm'
import Button from '../../components/Button'
import ContactInformation from '../../components/ContactInformation'
import FormSection from '../../components/FormSection'
import Headline from '../../components/Headline'
import ProjectGoalsForm from '../../components/ProjectGoalsForm'
import Section from '../../components/Section'
import Subtitle from '../../components/Subtitle'

import BudgetFormProps from '../../interfaces/BudgetFormProps'
import ContactInformationProps from '../../interfaces/ContactInformationProps'
import ServiceInformationFormProps from '../../interfaces/ServiceInformationFormProps'

import { CREATE_CONSULTATION } from '../../operations/mutations/ConsultationMutations'

import {
    PLEASE_FILL_OUT_THE_FORM,
    SUBMIT,
    CONTACT_INFORMATION,
    BUDGET_AND_TIMELINE,
    PROJECT_GOALS,
    FIELDS_WITH_ARE_REQUIRED,
    COMPLETE_REQUIRED_SECTIONS_TO_SUBMIT,
    REQUIRED_STEPS_COMPLETE
} from '../../constants/strings'

interface ServiceTypesFormProps {
    serviceTypes?: string[]
}

const ConsultationPage: NextPage = () => {

    const DEFAULT_MIN_BUDGET = 10000
    const DEFAULT_MAX_BUDGET = 50000

    const [budget, setBudget] = useState<BudgetFormProps>({
        minBudget: DEFAULT_MIN_BUDGET,
        maxBudget: DEFAULT_MAX_BUDGET
    })
    const [timeline, setTimeline] = useState<String[]>([])
    const [contactInformation, setContactInformation] = useState<ContactInformationProps>({})
    const [serviceInformation, setServiceInformation] = useState<ServiceInformationFormProps>({})
    const [services, setServices] = useState<String[]>([])
    const [contactInformationError, setContactInformationError] = useState(true)
    const [serviceInformationError, setServiceInformationError] = useState(true)
    const [budgetTimelineError, setBudgetTimelineError] = useState(true)
    const [disabledButton, setDisabledButton] = useState(true)
    const [projectGoals, setProjectGoals] = useState<string>('')
    const [constraints, setConstraints] = useState<string>('')

    const router = useRouter()

    // Drive the progress bar + per-section badges off the existing error flags.
    const contactComplete = !contactInformationError
    const budgetComplete = !budgetTimelineError
    const goalsComplete = !serviceInformationError
    const requiredTotal = 3
    const requiredDone = [contactComplete, budgetComplete, goalsComplete].filter(Boolean).length
    const remainingSections = [
        !contactComplete && CONTACT_INFORMATION,
        !budgetComplete && BUDGET_AND_TIMELINE,
        !goalsComplete && PROJECT_GOALS
    ].filter(Boolean) as string[]

    const [createConsultation] = useMutation(
        CREATE_CONSULTATION, {
            variables: {
                name: contactInformation.name,
                email: contactInformation.email,
                phone_number: contactInformation.phoneNumber,
                max_budget: `${budget.maxBudget}`,
                min_budget: `${budget.minBudget}`,
                company_type: contactInformation.clientType,
                project_goals: projectGoals,
                description: serviceInformation.projectGoal,
                constraints: constraints
            }
        }
    )

    useEffect(() => {
        setDisabledButton(
            contactInformationError ||
            serviceInformationError ||
            budgetTimelineError
        )
    }, [contactInformationError, serviceInformationError, budgetTimelineError])

    useEffect(() => {
        setProjectGoals(services.length ? services.join('. ') : '')
    }, [services])

    useEffect(() => {
        setConstraints(timeline.length ? timeline.join('. ') : '')
    }, [timeline])

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        if (disabledButton) return
        try {
            const res = await fetch('/api/sendgrid', {
                body: JSON.stringify({
                    services,
                    timeline,
                    ...budget,
                    ...contactInformation,
                    ...serviceInformation
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            })
            const { error } = await res.json()
            if (error) throw error
            createConsultation()
            sendMessage(contactInformation, budget, serviceInformation, projectGoals, constraints)
            router.push('/consultation/thanks')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='ConsultationPage'>
            <Section paddingTop='pt-8 md:pt-12' paddingBottom='pb-10 md:pb-12'>
                <Headline variant='h1'>
                    {PLEASE_FILL_OUT_THE_FORM}
                </Headline>
                <div className='mt-6 max-w-md'>
                    <div className='flex items-center justify-between mb-2'>
                        <Subtitle variant='xs-light' alignment='text-left'>
                            {REQUIRED_STEPS_COMPLETE}
                        </Subtitle>
                        <span className='text-sm font-semibold text-primary-dark'>
                            {requiredDone}/{requiredTotal}
                        </span>
                    </div>
                    <div className='h-2 w-full overflow-hidden rounded-full bg-solid-black/5'>
                        <div
                            className='h-full rounded-full bg-teal-gradient transition-all duration-500 ease-out'
                            style={{ width: `${(requiredDone / requiredTotal) * 100}%` }}
                        />
                    </div>
                </div>
            </Section>
            <form onSubmit={handleSubmit}>
                <FormSection title={CONTACT_INFORMATION} step={1} complete={contactComplete} defaultOpen>
                    <ContactInformation
                        setContactInformation={setContactInformation}
                        setContactInformationError={setContactInformationError}
                    />
                </FormSection>
                <FormSection title={BUDGET_AND_TIMELINE} step={2} complete={budgetComplete}>
                    <BudgetTimelineForm
                        setBudget={setBudget}
                        setTimeline={setTimeline}
                        setBudgetTimelineError={setBudgetTimelineError}
                        defaultBudget={[DEFAULT_MIN_BUDGET, DEFAULT_MAX_BUDGET]}
                    />
                </FormSection>
                <FormSection title={PROJECT_GOALS} step={3} complete={goalsComplete}>
                    <ProjectGoalsForm
                        setServiceInformation={setServiceInformation}
                        setServices={setServices}
                        setServiceInformationError={setServiceInformationError}
                    />
                </FormSection>
                <Section>
                    <div className='flex flex-col items-center gap-5'>
                        {disabledButton && (
                            <div className='flex flex-col items-center gap-3'>
                                <Subtitle variant='xs-light' alignment='text-center'>
                                    {COMPLETE_REQUIRED_SECTIONS_TO_SUBMIT}
                                </Subtitle>
                                <div className='flex flex-wrap justify-center gap-2'>
                                    {remainingSections.map(name => (
                                        <span key={name} className='rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-500'>
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        <Button variant='tertiary' type='submit' disabled={disabledButton} className='w-full md:w-auto md:px-20'>
                            {SUBMIT}
                        </Button>
                        <Subtitle variant='xs-light' alignment='text-center'>
                            {FIELDS_WITH_ARE_REQUIRED}
                        </Subtitle>
                    </div>
                </Section>
            </form>
        </div>
    )
}

export default ConsultationPage
