const { POSTGRES } = require('../../../config/credentials.ts')

const {
    DB_HOST,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT
} = POSTGRES

const base = {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
}

module.exports = {
    development: base,
    staging: base,
    test: base,
    production: base
}
