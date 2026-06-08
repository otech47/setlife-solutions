import type { NextPage } from 'next'
import ContributorInquiryForm from '../../components/ContributorInquiryForm'
import Section from '../../components/Section'

const ContributorInquiryPage: NextPage = () => {
    return (
        <Section paddingTop='pt-8 md:pt-12'>
            <ContributorInquiryForm />
        </Section>
    )
}

export default ContributorInquiryPage