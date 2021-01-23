import {gql, useQuery, NetworkStatus} from '@apollo/client';

import {initializeApollo, addApolloState} from '../lib/apolloClient';

export const USERS = gql`
    query users($offset: Int, $limit: Int) {
        users(offset: $offset, limit: $limit) {
            title
            author
        },
    }
`;

const IndexPage = (props) => {
    console.log("-> props", props);
    const {loading, error, data, fetchMore, networkStatus} = useQuery(
        USERS,
        {
            variables: {
                offset: 0,
                limit: 1
            },
            // fetchPolicy: "network-only",
        }
    );
    console.log("-> data", data);


    if (loading) return <div>loading...</div>

    if (error) return <div>{JSON.stringify(error)}</div>

    return (
        <div onClick={async () => {
            const res = await fetchMore({variables: {offset: 1, limit: 1}})
            console.log("-> res", res);
        }}>
            {data?.users.map(user => <div key={user.title}>{user.title}</div>)}
        </div>)
}


export async function getStaticProps() {
    const apolloClient = initializeApollo();

    return addApolloState(apolloClient, {
        props: {},
        revalidate: 1,

    })
}

export default IndexPage