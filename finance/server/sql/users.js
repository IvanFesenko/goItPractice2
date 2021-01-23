import {camelizeKeys, decamelizeKeys, decamelize} from 'humps';
import {has} from 'lodash';
import bcrypt from 'bcryptjs';
import {getKnex} from "../knex";

const knex = getKnex();

const returnId = (knexTable) => knexTable.returning('id');

const userKeys = ['id', 'username', 'phoneNumber', 'email', 'role', 'isActive', 'isFreeze', 'createdAt'];
const profileKeys = ['firstName', 'lastName', 'middleName', 'country', 'address', 'age', 'refHash'];

class User {
    async getUsers(orderBy, filter) {
        const queryBuilder = knex
            .select(
                'u.id as id',
                'u.username as username',
                'u.is_active',
                'u.is_freeze',
                'u.email as email',
                'u.phone_number as phone_number',
                'up.first_name as first_name',
                'up.last_name as last_name',
                'up.middle_name as middle_name',
                'up.country as country',
                'up.address as address',
                'up.age as age',
                'up.ref_hash as ref_hash',
            )
            .from('user AS u')
            .leftJoin('user_profile AS up', 'up.user_id', 'u.id')

        // add order by
        if (orderBy && orderBy.column) {
            let column = orderBy.column;
            let order = 'asc';
            if (orderBy.order) {
                order = orderBy.order;
            }

            queryBuilder.orderBy(decamelize(column), order);
        }

        // add filter conditions
        if (filter) {
            if (has(filter, 'role') && filter.role !== '') {
                queryBuilder.where(function () {
                    this.where('u.role', filter.role);
                });
            }

            if (has(filter, 'isActive') && filter.isActive !== null) {
                queryBuilder.where(function () {
                    this.where('u.is_active', filter.isActive);
                });
            }

            if (has(filter, 'searchText') && filter.searchText !== '') {
                queryBuilder.where(function () {
                    this.where(knex.raw('LOWER(??) LIKE LOWER(?)', ['username', `%${filter.searchText}%`]))
                        .orWhere(knex.raw('LOWER(??) LIKE LOWER(?)', ['email', `%${filter.searchText}%`]))
                        .orWhere(knex.raw('LOWER(??) LIKE LOWER(?)', ['first_name', `%${filter.searchText}%`]))
                        .orWhere(knex.raw('LOWER(??) LIKE LOWER(?)', ['last_name', `%${filter.searchText}%`]));
                });
            }
        }

        return camelizeKeys(await queryBuilder);
    }

    async getUser(id) {
        const user = camelizeKeys(
            await knex
                .select(
                    'u.id',
                    'u.username',
                    'u.is_active',
                    'u.is_freeze',
                    'u.phone_number',
                    'u.email',
                    'up.first_name',
                    'up.last_name',
                    'up.middle_name',
                    'up.country',
                    'up.address',
                    'up.age',
                    'up.ref_hash',
                    'fa.fb_id',
                    'fa.display_name AS fbDisplayName',
                    'lna.ln_id',
                    'lna.display_name AS lnDisplayName',
                    'gha.gh_id',
                    'gha.display_name AS ghDisplayName',
                    'ga.google_id',
                    'ga.display_name AS googleDisplayName'
                )
                .from('user AS u')
                .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
                .leftJoin('auth_facebook AS fa', 'fa.user_id', 'u.id')
                .leftJoin('auth_google AS ga', 'ga.user_id', 'u.id')
                .leftJoin('auth_github AS gha', 'gha.user_id', 'u.id')
                .leftJoin('auth_linkedin AS lna', 'lna.user_id', 'u.id')
                .where('u.id', '=', id)
                .first());

        return Object.entries(user).reduce((acc, [key, value]) => {
            return userKeys.includes(key) ? {...acc, [key]: value} : {
                ...acc,
                profile: {...acc.profile, [key]: value}
            }
        }, {profile: {}});
    }

    async getUserWithPassword(id) {
        return camelizeKeys(
            await knex
                .select(
                    'u.id',
                    'u.username',
                    'u.password_hash',
                    'u.role',
                    'u.is_active',
                    'u.email',
                    'u.phone_number',
                    'up.first_name',
                    'up.last_name',
                    'up.middle_name'
                )
                .from('user AS u')
                .where('u.id', '=', id)
                .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
                .first()
        );
    }

    register({username, email, phoneNumber, role = 'user', isActive, isFreeze}, passwordHash) {
        return returnId(knex('user'))
            .insert(decamelizeKeys({username, email, phoneNumber, role, passwordHash, isActive, isFreeze}));
    }

    createFacebookAuth({id, displayName, userId}) {
        return returnId(knex('auth_facebook')).insert({fb_id: id, display_name: displayName, user_id: userId});
    }

    createGithubAuth({id, displayName, userId}) {
        return returnId(knex('auth_github')).insert({gh_id: id, display_name: displayName, user_id: userId});
    }

    createGoogleOAuth({id, displayName, userId}) {
        return returnId(knex('auth_google')).insert({google_id: id, display_name: displayName, user_id: userId});
    }

    createLinkedInAuth({id, displayName, userId}) {
        return returnId(knex('auth_linkedin')).insert({ln_id: id, display_name: displayName, user_id: userId});
    }

    editUser({id, username, email, role, isActive, isFreeze, phoneNumber}, passwordHash) {
        const localAuthInput = passwordHash ? {phoneNumber, passwordHash} : {phoneNumber};
        return knex('user')
            .update(decamelizeKeys({username, role, isActive, isFreeze, email, ...localAuthInput}))
            .where({id});
    }

    async isUserProfileExists(userId) {
        return !!(await knex('user_profile')
            .count('id as count')
            .where(decamelizeKeys({userId}))
            .first()).count;
    }

    editUserProfile({id, profile}, isExists) {
        if (isExists) {
            return knex('user_profile')
                .update(decamelizeKeys(profile))
                .where({user_id: id});
        } else {
            return returnId(knex('user_profile')).insert({...decamelizeKeys(profile), user_id: id});
        }
    }

    deleteUser(id) {
        return knex('user')
            .where('id', '=', id)
            .del();
    }

    async updatePassword(id, newPassword) {
        const passwordHash = await bcrypt.hash(newPassword, 12);

        return knex('user')
            .update({password_hash: passwordHash})
            .where({id});
    }

    updateActive(id, isActive) {
        return knex('user')
            .update({is_active: isActive})
            .where({id});
    }

    updateFreeze(id, isFreeze) {
        return knex('user')
            .update({is_active: isFreeze})
            .where({id});
    }

    async getUserByEmail(email) {
        return camelizeKeys(
            await knex
                .select(
                    'u.id',
                    'u.username',
                    'u.password_hash',
                    'u.role',
                    'u.is_active',
                    'u.email',
                    'u.is_freeze',
                    'u.phone_number',
                    'up.first_name',
                    'up.last_name',
                    'up.middle_name'
                )
                .from('user AS u')
                .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
                .where({email})
                .first()
        );
    }

    async getUserByPhoneNumber(phoneNumber) {
        return camelizeKeys(
            await knex
                .select(
                    'u.id',
                    'u.username',
                    'u.password_hash',
                    'u.role',
                    'u.is_active',
                    'u.email',
                    'u.is_freeze',
                    'u.phone_number',
                    'up.first_name',
                    'up.last_name',
                    'up.middle_name'
                )
                .from('user AS u')
                .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
                .where('u.phone_number', '=', phoneNumber)
                .first()
        );
    }

    async getUserByFbIdOrEmail(id, email) {
        return camelizeKeys(
            await knex
                .select(
                    'u.id',
                    'u.username',
                    'u.role',
                    'u.is_active',
                    'fa.fb_id',
                    'u.email',
                    'u.is_freeze',
                    'u.phone_number',
                    'up.first_name',
                    'up.last_name',
                    'up.middle_name'
                )
                .from('user AS u')
                .leftJoin('auth_facebook AS fa', 'fa.user_id', 'u.id')
                .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
                .where('fa.fb_id', '=', id)
                .orWhere('u.email', '=', email)
                .first()
        );
    }

    async getUserByLnInIdOrEmail(id, email) {
        return camelizeKeys(
            await knex
                .select(
                    'u.id',
                    'u.username',
                    'u.role',
                    'u.is_active',
                    'lna.ln_id',
                    'u.email',
                    'u.password_hash',
                    'u.is_freeze',
                    'u.phone_number',
                    'up.first_name',
                    'up.last_name',
                    'up.middle_name'
                )
                .from('user AS u')
                .leftJoin('auth_linkedin AS lna', 'lna.user_id', 'u.id')
                .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
                .where('lna.ln_id', '=', id)
                .orWhere('u.email', '=', email)
                .first()
        );
    }

    async getUserByGHIdOrEmail(id, email) {
        return camelizeKeys(
            await knex
                .select(
                    'u.id',
                    'u.username',
                    'u.role',
                    'u.is_active',
                    'gha.gh_id',
                    'u.email',
                    'u.password_hash',
                    'u.is_freeze',
                    'u.phone_number',
                    'up.first_name',
                    'up.last_name',
                    'up.middle_name'
                )
                .from('user AS u')
                .leftJoin('auth_github AS gha', 'gha.user_id', 'u.id')
                .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
                .where('gha.gh_id', '=', id)
                .orWhere('u.email', '=', email)
                .first()
        );
    }

    async getUserByGoogleIdOrEmail(id, email) {
        return camelizeKeys(
            await knex
                .select(
                    'u.id',
                    'u.username',
                    'u.role',
                    'u.is_active',
                    'ga.google_id',
                    'u.email',
                    'u.password_hash',
                    'u.is_freeze',
                    'u.phone_number',
                    'up.first_name',
                    'up.last_name',
                    'up.middle_name'
                )
                .from('user AS u')
                .leftJoin('auth_google AS ga', 'ga.user_id', 'u.id')
                .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
                .where('ga.google_id', '=', id)
                .orWhere('u.email', '=', email)
                .first()
        );
    }

    async getUserByUsername(username) {
        return camelizeKeys(
            await knex
                .select(
                    'u.id',
                    'u.username',
                    'u.role',
                    'u.is_active',
                    'u.email',
                    'u.is_freeze',
                    'u.phone_number',
                    'up.first_name',
                    'up.last_name',
                    'up.middle_name'
                )
                .from('user AS u')
                .where('u.username', '=', username)
                .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
                .first()
        );
    }

    async getUserByUsernameOrEmail(usernameOrEmail) {
        return camelizeKeys(
            await knex
                .select(
                    'u.id',
                    'u.username',
                    'u.password_hash',
                    'u.role',
                    'u.is_active',
                    'u.email',
                    'u.is_freeze',
                    'u.phone_number',
                    'up.first_name',
                    'up.last_name',
                    'up.middle_name'
                )
                .from('user AS u')
                .where('u.username', '=', usernameOrEmail)
                .orWhere('u.email', '=', usernameOrEmail)
                .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
                .first()
        );
    }
}

const userDAO = new User();

export default userDAO;