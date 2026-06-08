import { useEffect, useState } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import Paragraph from './Paragraph'
import OptionChip from './OptionChip'

import {
    MIN,
    MAX,
    PROJECT_WITH_PROPOSED_BUDGETS,
    SELECT_AN_ESTIMATED_BUDGET_RANGE_FOR_YOUR_PROJECT,
    DESCRIBE_ANY_TIMELINE_AND_BUDGET_CONSTRAINTS_FOR_YOUR_PROJECT,
    NEED_URGENT_DELIVERY,
    PREFER_MILESTONE_BASED_DELIVERY,
    SEEKING_LONG_TERM_STABLE_DEVELOPMENT,
    HAVE_SECURED_CAPITAL,
    CURRENTLY_RAISING_FUNDS,
    HAVE_SOME_CAPITAL,
    PROJECT_IS_ALREADY_UP,
    STARTING_MY_PROJECT_FROM_SCRATCH,
    STARTED_DEVELOPMENT_BUT_NEED_ASSISTANCE,
    SERVICE_PACKAGES,
    TO_GET_A_SENSE
} from '../constants/strings'

interface BudgetTimelineFormProps {
    setBudget: any,
    setTimeline: any,
    setBudgetTimelineError: any,
    defaultBudget: number[],
}

const BudgetTimelineForm = ({
    setBudget,
    setTimeline,
    setBudgetTimelineError,
    defaultBudget,
}: BudgetTimelineFormProps) => {

    const [minBudgetValue, setMinBudgetValue] = useState(defaultBudget[0])
    const [maxBudgetValue, setMaxBudgetValue] = useState(defaultBudget[1])
    const [timelineValues, setTimelineValues] = useState<string[]>([])
    const [windowSize, setWindowSize] = useState<string>('')

    // This section is required: a budget range always has a value (slider /
    // presets default it), so the gate is "tell us at least one constraint".
    useEffect(() => {
        setTimeline(timelineValues)
        setBudgetTimelineError(timelineValues.length === 0)
    }, [timelineValues])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 640) {
                setWindowSize('sm')
            }
        } 
    }, [windowSize])

    const applyBudget = (min: number, max: number) => {
        setMinBudgetValue(min)
        setMaxBudgetValue(max)
        setBudget({
            minBudget: min,
            maxBudget: max
        })
    }

    const onSliderChange = (value: any) => {
        applyBudget(value[0], value[1])
    }

    // One-click ranges that snap the slider; the slider stays for fine-tuning.
    const budgetPresets = [
        [1000, 10000],
        [10000, 25000],
        [25000, 50000],
        [50000, 100000]
    ]

    const presetLabel = (min: number, max: number) => {
        const fmt = (n: number) => (n >= 1000 ? `$${n / 1000}k` : `$${n}`)
        if (max >= 100000) return `${fmt(min)}+`
        return `${fmt(min)} – ${fmt(max)}`
    }

    const addTimelineValue = (timeline: string) => {
        if (timelineValues.includes(timeline)) {
            setTimelineValues(
                timelineValues.filter(value => value != timeline)
            )
            return
        }
        setTimelineValues([...timelineValues, timeline])
    }

    const formatAmount = (amount: number) => {
        if (amount == 100000) return `+$${amount / 1000}k`
        if (amount > 999) return `$${amount / 1000}k`
        return `$${amount}`
    }

    const renderTimelineTypes = () => {
        const timelineTypes = [
            {
                name: NEED_URGENT_DELIVERY,
            },
            {
                name: PREFER_MILESTONE_BASED_DELIVERY
            },
            {
                name: SEEKING_LONG_TERM_STABLE_DEVELOPMENT
            },
            {
                name: HAVE_SECURED_CAPITAL
            },
            {
                name: CURRENTLY_RAISING_FUNDS
            },
            {
                name: HAVE_SOME_CAPITAL
            },
            {
                name: PROJECT_IS_ALREADY_UP
            },
            {
                name: STARTING_MY_PROJECT_FROM_SCRATCH
            },
            {
                name: STARTED_DEVELOPMENT_BUT_NEED_ASSISTANCE
            }
        ]
        return timelineTypes.map(timeline => (
            <OptionChip
                key={timeline.name}
                label={timeline.name}
                selected={timelineValues.includes(timeline.name)}
                onSelect={() => addTimelineValue(timeline.name)}
            />
        ))
    }
    
    return (
        <div className='BudgetTimelineForm'>
            <div className='grid grid-flow-row auto-rows-max gap-8 w-full md:w-8/12'>
                <Paragraph>
                    <>
                        {PROJECT_WITH_PROPOSED_BUDGETS}
                        <a className='text-primary hover:underline hover:underline-offset-1' href='/service-packages'>
                            {SERVICE_PACKAGES}
                        </a>
                        {TO_GET_A_SENSE}
                    </>
                </Paragraph>
                <Paragraph variant='m-bold'>
                    {SELECT_AN_ESTIMATED_BUDGET_RANGE_FOR_YOUR_PROJECT}
                </Paragraph>
                <div className='flex flex-wrap gap-3'>
                    {budgetPresets.map(([min, max]) => (
                        <OptionChip
                            key={`${min}-${max}`}
                            label={presetLabel(min, max)}
                            selected={minBudgetValue === min && maxBudgetValue === max}
                            onSelect={() => applyBudget(min, max)}
                        />
                    ))}
                </div>
                <div className='grid grid-cols-2 justify-items-center'>
                    <div>
                        <Paragraph variant='m-bold' color='primary' alignment='text-center'>
                            {MIN}
                        </Paragraph>
                        <Paragraph>
                            {formatAmount(minBudgetValue)}
                        </Paragraph>
                    </div>
                    <div>
                        <Paragraph variant='m-bold' color='primary' alignment='text-center'>
                            {MAX}
                        </Paragraph>
                        <Paragraph>
                            {formatAmount(maxBudgetValue)}
                        </Paragraph>
                    </div>
                </div>
                <div className='range-slider md:px-8 px-5'>
                    <Slider
                        range
                        allowCross={false}
                        min={1000}
                        max={100000}
                        value={[minBudgetValue, maxBudgetValue]}
                        onChange={onSliderChange}
                        step={500}
                        railStyle={{
                            height: 2,
                            backgroundColor: '#C5C5C5'  
                        }}
                        handleStyle={{
                            height: windowSize == 'sm' ? 18 : 28,
                            width: windowSize == 'sm' ? 18 : 28,
                            marginLeft: windowSize == 'sm' ? -5 : -14,
                            marginTop: windowSize == 'sm' ? -8 : -14,
                            backgroundColor: '#00C2D4',
                            border: 0
                        }}
                        trackStyle={{
                            background: '#00C2D4'
                        }}
                    />
                </div>
                <div className='mt-8'>
                    <Paragraph variant='m-bold'>
                        {DESCRIBE_ANY_TIMELINE_AND_BUDGET_CONSTRAINTS_FOR_YOUR_PROJECT}
                    </Paragraph>
                </div>
                <div className='flex flex-wrap gap-3'>
                    { renderTimelineTypes() }
                </div>
            </div>
        </div>
    )
}

export default BudgetTimelineForm