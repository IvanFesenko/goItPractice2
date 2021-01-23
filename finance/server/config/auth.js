const {loadEnvConfig} = require('@next/env')

const dev = process.env.NODE_ENV !== 'production'
const {AUTH_SECRET} = loadEnvConfig('./', dev).combinedEnv

export default {
    secret: process.env.NODE_ENV === 'test' ? 'secret for tests' : AUTH_SECRET,
    jwt: {
        enabled: true,
        tokenExpiresIn: '1d'
    },
    password: {
        requireSMSConfirmation: true,
        minLength: 8,
    },
}