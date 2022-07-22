const knex = require('../database/knex');
const redis = require('../database/redis');
const CustomError = require('../error');

class UserDAO {
    async readUserInfo(username) {
        try {
            return await knex.raw(
                'CALL read_user_info(?)', [username]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async readUserInfoWithMatchingUsername(username) {
        try {
            let res = await knex.raw(
                'CALL read_user_info_with_matching_username(?)', 
                [username]
            );
            return res[0][0][0];
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async readUserInfoWithMatchingEmail(email) {
        try {
            let res = await knex.raw(
                'CALL read_user_info_with_matching_email(?)', 
                [email]
            );
            return res[0][0][0];
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async readAllUsersInfo(offset, limit) {
        try {
            return await knex.raw(
                'CALL read_all_users_info(?, ?)',
                [offset, limit]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async readUserPasswordHash(userId) {
        try {
            return await knex.raw(
                'CALL read_user_password_hash(?)', 
                [userId]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async checkUserAlreadyLoggedIn(username) {
        try {
            const user = await redis.hgetall(username);
            console.log(user);
            if (!Object.keys(user).length) {
                return false;
            }
            if (user['status'] === 'online') return true;
            if (user['status'] === 'offline') return false;
            throw CustomError.UnhandledError('Invalid user status value.');
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async createUser(userId, info) {
        try {
            const { username, passwordHash, email } = info;
            return await knex.raw(
                'CALL create_user(?, ?, ?, ?, ?, ?)',
                [userId, username, passwordHash, email, 'user', 1]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async updateUserName(userId, username) {
        try {
            return await knex.raw(
                'CALL update_username(?, ?)',
                [userId, username]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async updatePasswordHash(userId, hash) {
        try {
            return await knex.raw(
                'CALL update_password_hash(?, ?)',
                [userId, hash]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async updateEmail(userId, email) {
        try {
            return await knex.raw(
                'CALL update_email(?, ?)',
                [userId, email]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async updateRole(userId, role) {
        try {
            return await knex.raw(
                'CALL update_role(?, ?)',
                [userId, role]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async updateCanEdit(userId, canEdit) {
        try {
            return await knex.raw(
                'CALL update_can_edit(?, ?)',
                [userId, canEdit]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async deleteUser(username) {
        try {
            const info = await knex.raw(
                'CALL read_user_info(?)', [username]
            );
            await knex.raw(
                'CALL delete_user(?)', [username]
            );
            return info;
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    _handleDBError(error) {
        if (error.sqlMessage == null || error.errno == null) {
            return error;
        }
        
        // The sqlMessage was created by me.
        if (error.sqlMessage.includes(':')) {
            const [errorType, specific] = error.sqlMessage.split(':');
            if (errorType === 'ResourceDNE') {
                throw CustomError.ResourceDoesNotExist(specific);
            }
            
            if (errorType === 'NullID') {
                return CustomError.MissingRequiredURLParamAttr(specific);
            }
        }

        if (error.errno === 1062) {
            const attributeName = getNameOfDupAttribute(error.sqlMessage)
            return CustomError.DuplicateAttributeValue(attributeName);

            function getNameOfDupAttribute(errorMessage) {
                const removedQuotes = errorMessage.split("'");
                return removedQuotes[removedQuotes.length - 2];
            }
        }

        return CustomError.UnhandledError(error);
    }
}


module.exports = UserDAO;