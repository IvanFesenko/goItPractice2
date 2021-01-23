const {loadEnvConfig} = require('@next/env')

const dev = process.env.NODE_ENV !== 'production'
const {DB_HOST, DB_DATABASE, DB_USER, DB_PASS} = loadEnvConfig('./', dev).combinedEnv

module.exports = {
    client: 'pg',
    connection: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_DATABASE,
        multipleStatements: true,
        charset: 'utf8',
        ssl: {
            rejectUnauthorized: false
        }
    },
    migrations: {
        directory: './server/knex/migrations',
    },
    seeds: {
        directory: './server/knex/seeds',
    },
}