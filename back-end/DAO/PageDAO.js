// TODO: Validate that when updating, reading, or deleting a page,
//       the page_id exists in the database.

const knex = require('../database/knex');
const CustomError = require('../error');

class PageDAO {
    async createPage(pageId, username, userId, content) {
        try {
            const { title, imageUrl, lead, body } = content;
            return await knex.raw(
                'CALL create_page(?, ?, ?, ?, ?)',
                [pageId, title, username, userId, imageUrl, lead, body]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async readPage(pageId) {
        try {
            return await knex.raw(
                'CALL read_page(?)', [pageId]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async readAllPages() {
        try {
            return await knex.raw(
                'CALL read_all_pages()'
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async readPagesBasedOnSearchString(searchString) {
        try {
            return await knex.raw(
                'CALL read_pages_based_on_search_string(?)',
                [searchString]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async updateContent(pageId, username, userId, content) {
        try {
            const { title, imageUrl, lead, body } = content;
            return await knex.raw(
                'CALL update_content(?, ?, ?, ?, ?)',
                [username, userId, pageId, title, imageUrl, lead, body]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async updateFreezePage(pageId, username, userId, freezePage) {
        try {
            return await knex.raw(
                'CALL update_freeze_page(?, ?)',
                [pageId, username, userId, freezePage]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async updateUsername(userId, username) {
        try {
            return await knex.raw(
                'CALL update_username_in_pages(?, ?)',
                [userId, username]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async deletePage(pageId) {
        try {
            const deletedPage = await knex.raw(
                'CALL read_page(?)', [pageId]
            );
            await knex.raw(
                'CALL delete_page(?)', [pageId]
            );
            return deletedPage;
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
                return CustomError.ResourceDoesNotExist(specific);
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

module.exports = PageDAO;