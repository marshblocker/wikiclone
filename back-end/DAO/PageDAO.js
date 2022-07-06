// TODO: Validate that when updating, reading, or deleting a page,
//       the page_id exists in the database.

const knex = require('../database/knex');
const CustomError = require('../error');

class PageDAO {
    async createPage(pageId, username, content) {
        try {
            const { title, imageUrl, lead, body } = content;
            return await knex.raw(
                'CALL create_page(?, ?, ?, ?, ?)',
                [pageId, title, username, imageUrl, lead, body]
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

    async updateFreezePage(pageId, freezePage) {
        try {
            return await knex.raw(
                'CALL update_freeze_page(?, ?)',
                [pageId, freezePage]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async updateContent(pageId, content) {
        try {
            const { title, imageUrl, lead, body } = content;
            return await knex.raw(
                'CALL update_content(?, ?, ?, ?, ?)',
                [pageId, title, imageUrl, lead, body]
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