import React, { useEffect, useRef, useState } from 'react';

import Button from './Button';
import Headline from './Headline';
import Paragraph from './Paragraph';

import { 
    PDF_ICON,
    CANCEL_ICON,
    CONTRIBUTOR_INQUIRY_IMAGE
} from '../constants';
import { 
    ADD_MORE_DETAILS,
    EMAIL, 
    LINK_TO_YOUR_WORK, 
    OPTIONAL, 
    PLEASE_FILL_OUT_CONTRIBUTE_FORM, 
    SUBMIT, 
    SUBMIT_CV 
} from '../constants/strings';

const ContributorInquiryForm = ({}) => {

    const [email, setEmail] = useState('')
    const [linkToWork, setLinkToWork] = useState('')
    const [submitCVName, setSubmitCVName] = useState('')
    const [CV, setCV] = useState(null)
    const [moreDetails, setMoreDetails] = useState('')
    const [openMoreDetails, setOpenMoreDetails] = useState(false)
    const [disabled, setDisabled] = useState(true)

    const hiddenFileInput = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (email && linkToWork && CV) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [email, linkToWork, CV])

    const renderInputs = () => {
        const basicInformationFields = [
            {
                name: EMAIL,
                value: email,
                setValue: setEmail
            },
            {
                name: LINK_TO_YOUR_WORK,
                value: linkToWork,
                setValue: setLinkToWork
            }
        ]
        return basicInformationFields.map(input => {
            return (
                <div>
                    <label
                        className='relative block p-3 border-2 rounded-full border-primary'
                        htmlFor={input.name}
                        key={input.name}
                    >
                        <input
                            className='w-full px-4 pt-3.5 pb-0 text-sm placeholder-transparent border-none focus:ring-0 peer'
                            id={input.name}
                            type='text'
                            placeholder={input.name}
                            required
                            value={input.value}
                            onChange={(e) => { input.setValue(e.target.value) }}
                        />
                        <span className='absolute text-xs px-4 font-medium text-gray-500 transition-all left-3 peer-focus:text-xs peer-focus:top-3 peer-focus:translate-y-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm'>
                            { input.name }
                        </span>
                    </label>
                </div>
            )
        })
    }

    const handleFile = (file: any) => {
        const fileUploaded = file.target.files[0]
        setSubmitCVName(fileUploaded
            ? fileUploaded.name
            : ''
        )
        setCV(fileUploaded)
    }

    return (
        <div className='ContributorInquiryForm grid grid-cols-1 md:grid-cols-2'>
            <div className='grid grid-rows-7 gap-8 px-2 lg:px-4'>
                <div>
                    <Headline variant='h1' color='solid-black'>
                        {PLEASE_FILL_OUT_CONTRIBUTE_FORM}
                    </Headline>
                </div>
                <div>
                    <Paragraph>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi ipsum vitae laudantium obcaecati quia! Cum, adipisci sit placeat odit, dolorum, quas nulla dolores ea tempore explicabo quod animi. Quos, incidunt?
                    </Paragraph>
                </div>
                {renderInputs()}
                <div>
                    <div className='grid grid-cols-4'>
                        <div className='col-span-3'>
                            <span className={`block p-4 border-2 rounded-full border-primary ${submitCVName ? 'bg-primary' : 'bg-solid-white'}`}>
                                <div className='grid grid-cols-7'>
                                    <div className='col-span-6 truncate text-solid-white text-ellipsis overflow-hidden'>
                                        <span className={`text-sm px-4 font-medium left-3 ${submitCVName ? 'text-solid-white' : 'text-gray-500'}`}>
                                            {
                                                submitCVName
                                                    ? submitCVName
                                                    : SUBMIT_CV
                                            }
                                        </span>
                                    </div>
                                    <div 
                                        className='justify-self-end' 
                                        onClick={() => { 
                                            setSubmitCVName('')
                                            setCV(null)
                                        }}
                                    >
                                        <img 
                                            className={`cursor-pointer mr-2 ${submitCVName ? 'inline' : 'hidden'}`}
                                            src={CANCEL_ICON} 
                                            alt='Cancel'
                                        />
                                    </div>
                                </div>
                            </span>
                        </div>
                        <div className='justify-self-end mt-1' onClick={() => { hiddenFileInput.current?.click() }}>
                            <Button variant='tertiary'>
                                <input 
                                    className='hidden'
                                    type='file' 
                                    accept='application/pdf' 
                                    ref={hiddenFileInput}
                                    onChange={(e) => { handleFile(e) }}
                                />
                                <img src={PDF_ICON} alt='PDF' />
                            </Button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={`cursor-pointer ml-1 ${openMoreDetails ? 'hidden' : ''}`} onClick={() => setOpenMoreDetails(true)}>
                        <Paragraph color='primary'>
                            {ADD_MORE_DETAILS}
                        </Paragraph>
                    </div>
                    <textarea
                        className={`
                        ${openMoreDetails ? '' : 'hidden'}
                        form-control
                        block
                        w-full
                        px-3
                        py-1.5
                        bg-white 
                        bg-clip-padding
                        border border-2 
                        border-primary
                        rounded-lg
                        m-0
                        focus:ring-0
                        focus:border-primary
                    `}
                        id='formControlTextarea'
                        rows={6}
                        onChange={(e) => setMoreDetails(e.target.value)}
                        placeholder={ADD_MORE_DETAILS + ' ' + OPTIONAL}
                    />
                </div>
                <div className='justify-self-center md:justify-self-end'>
                    <Button variant='tertiary' disabled={disabled}>
                        {SUBMIT}
                    </Button>
                </div>
            </div>
            <div className='ml-5 hidden md:block'>
                <img src={CONTRIBUTOR_INQUIRY_IMAGE} alt='Inquiry' />
            </div>
        </div>
    )
}

export default ContributorInquiryForm