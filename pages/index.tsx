import type { NextPage } from 'next'
import { useQuery } from '@apollo/client'

import { GetTestData } from '../interfaces/TestInterfaces'

import { GET_TEST } from '../operations/queries/TestQueries'

import Hero from '../components/Hero'
import Services from '../components/Services'

const Home: NextPage = () => {

    const { error, data, loading } = useQuery<GetTestData>(
        GET_TEST
    )
  
    const {
        getTest
    } = {...data}

    if (error || loading) (
        <>
        ...
        </>
    )

    return (
        <h1 className='text-3xl font-bold'>
            <Hero />
            <Services />
        </h1>
    )
}

export default Home
