/**
 * Editorial data update (no schema change). Project copy lives only in the DB
 * (there are no seeders), so corrections to it ship as a data migration that
 * the release phase applies to staging and prod.
 *
 *  - Guatt is a discontinued project. Drop its external link so the detail page
 *    stops linking out to a dead domain, and rewrite the description in past
 *    tense so it reads as a reference rather than an active product. With
 *    project_resource null, ProjectDetailBanner / ProjectInformation render no
 *    "visit site" CTA.
 *  - CareerScore was acquired by Quotanda and is no longer live at its own
 *    domain, so point its external link at Quotanda and note the acquisition
 *    while keeping the focus on what the platform was.
 *
 * Matched by `name` (stable across the staging replica and prod) rather than by
 * primary key. Idempotent: re-running just re-applies the same values.
 */
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkUpdate(
            'projects',
            {
                description: 'Guatt was an early-stage venture building a bitcoin-native digital bank on Galoy\'s open-source banking platform. The product is no longer active.',
                project_resource: null,
                updated_at: new Date()
            },
            { name: 'Guatt' }
        )
        await queryInterface.bulkUpdate(
            'projects',
            {
                description: 'CareerScore was a job-application tracking platform that helped schools measure and improve student job placement. It was acquired by Quotanda.',
                project_resource: 'https://quotanda.com',
                updated_at: new Date()
            },
            { name: 'Careerscore' }
        )
    },

    async down(queryInterface) {
        await queryInterface.bulkUpdate(
            'projects',
            {
                description: 'Guatt is an early-stage startup building a bitcoin-native digital bank using Galoy`s open-source banking platform.',
                project_resource: 'https://guatt.io',
                updated_at: new Date()
            },
            { name: 'Guatt' }
        )
        await queryInterface.bulkUpdate(
            'projects',
            {
                description: 'CareerScore is a Job Application Tracking tool that helps schools measure and improve student job placement',
                project_resource: 'https://www.careerscore.com',
                updated_at: new Date()
            },
            { name: 'Careerscore' }
        )
    }
}
