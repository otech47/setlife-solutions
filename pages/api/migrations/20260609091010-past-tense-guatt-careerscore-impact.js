/**
 * Editorial data update (no schema change). Follow-up to
 * 20260608224844-update-guatt-careerscore-copy: that migration fixed the project
 * descriptions and links, but the "Impact" cards (project_details rows of
 * type 'impact') still read in present/forward tense and made two retired
 * products look active.
 *
 *  - Guatt (discontinued): rewrite the production-grade card in past tense so it
 *    no longer reads as a live product chasing seed investment.
 *  - CareerScore (acquired by Quotanda): rewrite the production-grade card to
 *    frame the acquisition as the outcome, and drop "continued" from the
 *    maintenance stat so it no longer implies an ongoing engagement.
 *
 * Matched by project_id + type + sub_type (each project has exactly one impact
 * card per sub_type), which is stable across the staging replica and prod.
 * Idempotent and reversible.
 */
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkUpdate(
            'project_details',
            {
                description: 'The product beta reached a demo-ready state on a production-scale foundation built to attract seed investment and further development.',
                updated_at: new Date()
            },
            { project_id: 10, type: 'impact', sub_type: 'production_grade' }
        )
        await queryInterface.bulkUpdate(
            'project_details',
            {
                description: 'Grew into a production-grade commercial product serving multiple customers before being acquired by Quotanda.',
                updated_at: new Date()
            },
            { project_id: 9, type: 'impact', sub_type: 'production_grade' }
        )
        await queryInterface.bulkUpdate(
            'project_details',
            {
                description: '3+ years of dedicated development and application maintenance',
                updated_at: new Date()
            },
            { project_id: 9, type: 'impact', sub_type: 'dedicated_development' }
        )
    },

    async down(queryInterface) {
        await queryInterface.bulkUpdate(
            'project_details',
            {
                description: 'Guatts product beta is demo-ready with a production-scale foundation to attract seed investment and drive further product development & engineering',
                updated_at: new Date()
            },
            { project_id: 10, type: 'impact', sub_type: 'production_grade' }
        )
        await queryInterface.bulkUpdate(
            'project_details',
            {
                description: 'Careerscore is now a production-grade commercial product servicing multiple customers and poised for future growth',
                updated_at: new Date()
            },
            { project_id: 9, type: 'impact', sub_type: 'production_grade' }
        )
        await queryInterface.bulkUpdate(
            'project_details',
            {
                description: '3+ years of dedicated development and continued application maintenance',
                updated_at: new Date()
            },
            { project_id: 9, type: 'impact', sub_type: 'dedicated_development' }
        )
    }
}
