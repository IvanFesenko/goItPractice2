import {ApolloServer} from 'apollo-server-micro';
import schema from '../../server/resolvers';

import {getUser} from '../../server/authentication/user'


const apolloServer = new ApolloServer({
    schema,
    context: async ({req}) => {
        const token = req.headers.authorization || '';

        const user = await getUser(token);

        return {user};
    },
});


export const config = {
    api: {
        bodyParser: false,
    },
}

export default apolloServer.createHandler({path: '/api/graphql'})
