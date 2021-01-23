import jwt from 'jsonwebtoken';

import config from '../config/auth';

const {secret} = config;

export const getUser = async (token) => {
    if (!token) return null;

    try {
        await jwt.verify(token, secret)
    } catch (e) {
        return null
    }

    const {user} = await jwt.decode(token);

    return user
}