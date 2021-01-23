import {gql} from 'apollo-server-micro'

const typeDefs = gql`
    type Query {
        users(offset: Int, limit: Int): [User!]!
        user(id:Int): User
    }
    type Mutation {
        signUp(
            email: String,
            phoneNumber: String,
            password: String,
            firstName: String,
            lastName: String,
            middleName: String
        ): SignUpPayload!
        signIn(
            phoneNumber: String,
            password: String,
        ): SignUpPayload!
    }
    type Subscription {
        # Subscription for users list
        usersUpdated(filter: FilterUserInput): UpdateUserPayload
    }
    type User {
        id: Int
        username: String
        phoneNumber: String
        email: String
        isActive: Boolean
        isFreeze: Boolean
        createdAt: String
        profile: Profile
    }
    type Profile {
        firstName: String
        lastName: String
        middleName: String
        country: String
        address: String
        age: Int
        refHash: String
    }
    type SignUpPayload {
        user: User
        token: String
    }
    type UpdateUserPayload {
        mutation: String!
        node: User!
    }
    input FilterUserInput {
        # search by username or email
        searchText: String
        # filter by role
        role: String
        # filter by isActive
        isActive: Boolean
    }
`

export default typeDefs;