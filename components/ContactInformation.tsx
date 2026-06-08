import { useEffect, useState } from 'react'

import Headline from './Headline'
import OptionChip from './OptionChip'

import { validEmail, validNumber } from '../utilities/validations'

import {
    THIS_PROJECT_IS_FOR,
    OTHER,
    EMAIL,
    NAME,
    PHONE_NUMBER,
    MYSELF,
    MY_OWN_STARTUP_SMALL_BUSINESS,
    CORPORATION,
    NON_PROFIT_ORGANIZATION,
    PUBLIC_GOVERNMENT_AGENCY,
    INVALID,
    PLEASE_SELECT_AT_LEAST_ONE_OPTION
} from '../constants/strings'

interface ContactInformationProps {
    setContactInformation: any,
    setContactInformationError: any
}

const ContactInformation = ({
    setContactInformation,
    setContactInformationError
}: ContactInformationProps) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [clientType, setClientType] = useState('')
    const [nameError, setNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [clientTypeError, setClientTypeError] = useState(false)
    // Only surface field errors once a field has been blurred, so we never
    // flash red while the user is still mid-typing a valid value.
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

    useEffect(() => {
        setContactInformation({
            name,
            email,
            phoneNumber, 
            clientType
        })

        if (
            email && 
            name && 
            clientType
        ) {
            setContactInformationError(
                nameError || 
                emailError ||
                clientTypeError
            )
        } else {
            setContactInformationError(true)
        }
    }, [name, email, phoneNumber, clientType])

    const renderInputs = () => {
        const basicInformationFields = [
            {
                name: NAME,
                value: name,
                error: nameError,
                onChange: (nameInput: any) => {
                    setName(nameInput)
                    setNameError(!nameInput)
                }
            },
            {
                name: EMAIL,
                value: email,
                error: emailError,
                onChange: (emailInput: any) => {
                    setEmail(emailInput)
                    setEmailError(!validEmail.exec(emailInput))
                }
            },
            {
                name: PHONE_NUMBER,
                value: phoneNumber,
                onChange: (phoneNumberInput: any) => {
                    setPhoneNumber(validNumber.exec(phoneNumberInput)
                        ? phoneNumberInput
                        : ''
                    )
                } 
            }
        ]
        return basicInformationFields.map(input => {
            const showError = Boolean(input.error) && touched[input.name]
            return (
                <div key={input.name}>
                    <label
                        className={`relative block p-3 border rounded-full transition-all duration-150 ${showError ? 'border-red-500' : 'border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'}`}
                        htmlFor={input.name}
                    >
                        <input
                            className='w-full px-4 pt-3.5 pb-0 text-sm placeholder-transparent border-none focus:ring-0 peer'
                            id={input.name}
                            type='text'
                            placeholder={input.name}
                            required
                            value={input.value}
                            onChange={(e) => input.onChange(e.target.value)}
                            onBlur={() => setTouched(prev => ({ ...prev, [input.name]: true }))}
                        />
                        <span className='absolute text-xs px-4 font-medium text-gray-500 transition-all left-3 peer-focus:text-xs peer-focus:top-3 peer-focus:translate-y-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm'>
                            { input.name }
                            <span className={`${input.name == PHONE_NUMBER ? 'hidden' : 'inline'}`}>*</span>
                        </span>
                    </label>
                    {showError && (
                        <span className='px-5 text-sm text-red-500'>
                            { INVALID } { input.name }
                        </span>
                    )}
                </div>
            )
        })
    }

    const renderClientTypes = () => {
        const handleClientTypeChange = (name: any) => {
            setClientType(name)
            setClientTypeError(false)
        }
        const clientTypes = [
            {
                name: MYSELF,
            },
            {
                name: MY_OWN_STARTUP_SMALL_BUSINESS,
            },
            {
                name: CORPORATION,
            },
            {
                name: NON_PROFIT_ORGANIZATION,
            },
            {
                name: PUBLIC_GOVERNMENT_AGENCY,
            },
            {
                name: OTHER,
            },
        ]
        return clientTypes.map(client => (
            <OptionChip
                key={client.name}
                label={client.name}
                selected={clientType == client.name}
                onSelect={() => handleClientTypeChange(client.name)}
            />
        ))
    }

    return (
        <div className='ContactInformation'>
            <div className='grid grid-flow-row auto-rows-max gap-8 w-full md:w-6/12'>
                { renderInputs() }
            </div>
            <div className='grid grid-flow-row auto-rows-max gap-6 w-full md:w-8/12 mt-10'>
                <Headline
                    color='primary'
                    variant='alternative'
                >
                    {THIS_PROJECT_IS_FOR + '*'}
                </Headline>
                <div className='flex flex-wrap gap-3'>
                    { renderClientTypes() }
                </div>
                {clientTypeError && (
                    <span className='px-5 text-red-600'>
                        { PLEASE_SELECT_AT_LEAST_ONE_OPTION }
                    </span>
                )}
            </div>
        </div>
    )
}

export default ContactInformation