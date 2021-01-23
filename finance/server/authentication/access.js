import jwt from 'jsonwebtoken';
import config from '../config/auth';

const {jwt: {tokenExpiresIn}, secret} = config;

const createToken = async (user) => {

    const createToken = jwt.sign({user}, secret, {expiresIn: tokenExpiresIn});

    return Promise.all([createToken]);
};

export default createToken;
