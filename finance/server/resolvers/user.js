import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import {UserInputError, AuthenticationError} from 'apollo-server-micro';
import {PubSub, withFilter} from 'graphql-subscriptions';
import {nanoid} from 'nanoid/async';

import {sendMessage} from "../sms";

import createTransaction from "../knex/createTransaction";
import User from "../sql/users";
import config from '../config/auth';
import {createPasswordHash, validateUserPassword} from "../helpers/password";
import createToken from "../authentication/access";
import {validate} from '../helpers/validations'

const {secret, password} = config;

const pubsub = new PubSub();
const USERS_SUBSCRIPTION = 'users_subscription';

const resolvers = {
    Query: {
        users: async (_parent, {offset = 0, limit = 0}) => {
            return User.getUsers();
        },
        user: async (_parent, {id}) => {
            if (!id) throw new UserInputError('id is missing');
            try {
                return User.getUser(id);
            } catch (e) {
                throw e;
            }

        },
    },
    Mutation: {
        signUp: async (_parent, input) => {
            const validationErrors = validate(input);
            if (validationErrors) {
                throw new UserInputError(
                    'Failed to get events due to validation errors',
                    {errors: validationErrors}
                );
            }
            const errors = {};
            const phoneNumberExist = await User.getUserByPhoneNumber(input.phoneNumber);
            if (phoneNumberExist) {
                errors.phoneNumber = 'Phone number already exists.';
            }
            const emailExists = await User.getUserByEmail(input.email);
            if (emailExists) {
                errors.email = 'E-mail already exists.';
            }
            if (input.password.length < password.minLength) {
                errors.password = `Password must be ${password.minLength} characters or more.`;
            }

            if (!isEmpty(errors)) throw new UserInputError(
                'Failed to get events due to validation errors',
                {errors}
            );

            const passwordHash = await createPasswordHash(input.password);

            const trx = await createTransaction();
            let createdUserId;
            try {
                const {email, phoneNumber, isActive, isFreeze, password, ...profileInfo} = input;

                [createdUserId] = await User.register(
                    {
                        email: input.email,
                        phoneNumber: input.phoneNumber,
                        isActive: input.isActive ?? true,
                        isFreeze: input.isFreeze ?? false,
                    }, passwordHash).transacting(trx);

                const refHash = await nanoid(12);

                await User.editUserProfile(
                    {
                        id: createdUserId,
                        profile: {...profileInfo, refHash}
                    }
                ).transacting(trx);

                await trx.commit();
            } catch (e) {
                await trx.rollback();
            }

            try {
                const user = await User.getUser(createdUserId);
                await pubsub.publish(USERS_SUBSCRIPTION, {
                    usersUpdated: {
                        mutation: 'CREATED',
                        node: user
                    }
                });
                const [token] = await createToken({
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    id: user.id,
                    role: user.role
                })
                return {user, token};
            } catch (e) {
                return e;
            }
        },
        signIn: async (_parent, input) => {
            const user = await User.getUserByPhoneNumber(input.phoneNumber);
            const errors = await validateUserPassword(user, password);

            if (!isEmpty(errors)) throw new UserInputError('Failed valid user password', {errors});

            const [token] = await createToken({
                email: user.email,
                phoneNumber: user.phoneNumber,
                id: user.id,
                role: user.role
            })
            return {user, token};
        },
        editUser: async (_parent, input, {user}) => {

            if (!user) throw new AuthenticationError('authentication is required');

            const isSelf = user.id === input.id;
            const errors = {};
            const userExists = await User.getUserByPhoneNumber(input.phoneNumber);
            if (userExists && userExists.id !== input.id) {
                errors.phoneNumber = 'user with this phone number doesnt exits';
            }

            const emailExists = await User.getUserByEmail(input.email);
            if (emailExists && emailExists.id !== input.id) {
                errors.email = 'user with this phone number doesnt exits';
            }

            if (!isEmpty(errors)) throw new UserInputError('Failed to get events due to validation errors', {errors});

            const userInfo = !isSelf ? input : pick(input, ['id', 'username', 'email']);
        }
    },
    Subscription: {
        usersUpdated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(USERS_SUBSCRIPTION),
                (payload, variables) => {
                    const {mutation, node} = payload.usersUpdated;
                    const {
                        filter: {isActive, role, searchText}
                    } = variables;

                    const checkByFilter =
                        !!node.isActive === isActive &&
                        (!role || role === node.role) &&
                        (!searchText ||
                            node.username.toUpperCase().includes(searchText.toUpperCase()) ||
                            node.email.toUpperCase().includes(searchText.toUpperCase()));

                    switch (mutation) {
                        case 'DELETED':
                            return true;
                        case 'CREATED':
                            return checkByFilter;
                        case 'UPDATED':
                            return !checkByFilter;
                    }
                }
            )
        }
    }
};


export default resolvers;