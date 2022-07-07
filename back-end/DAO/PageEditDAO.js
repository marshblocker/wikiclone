const knex = require('../database/knex');
const CustomError = require('../error');

class PageEditDAO {
    async createPageEdit(pageEditId, pageVersion, timestamp, 
                         editSummary, userId, username, 
                         role, pageId, freezePage, content) {
        try {
            const { title, imageUrl, lead, body } = content;
            return await knex.raw(
                'CALL create_page_edit(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    pageEditId, pageVersion, timestamp, editSummary, userId, username, 
                    role, pageId, freezePage, title, imageUrl, lead, body
                ]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async readPageEdit(pageEditId) {
        try {
            return await knex.raw(
                'CALL read_page_edit(?)', [pageEditId]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async readPageEditsByPageId(pageId) {
        try {
            return await knex.raw(
                'CALL read_page_edits_by_page_id()',
                [pageId]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async readAllPageEdits() {
        try {
            return await knex.raw(
                'CALL read_all_page_edits()'
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async updateEditSummary(pageEditId, editSummary) {
        try {
            return await knex.raw(
                'CALL update_edit_summary(?, ?)',
                [pageEditId, editSummary]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async updateUsername(userId, username) {
        try {
            return await knex.raw(
                'CALL update_username_in_page_edits(?, ?)',
                [userId, username]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async updateRole(userId, role) {
        try {
            return await knex.raw(
                'CALL update_role_in_page_edits(?, ?)',
                [userId, role]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async deletePageEdit(pageEditId) {
        try {
            const deletedPageEdit = await knex.raw(
                'CALL read_page_edit(?)', [pageEditId]
            );
            await knex.raw(
                'CALL delete_page_edit(?)', [pageEditId]
            );
            return deletedPageEdit;
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async deletePageEditsOfDeletedPage(pageId) {
        try {
            const deletedPageEdits = await knex.raw(
                'CALL read_page_edits_by_page_id(?)', [pageId]
            );
            await knex.raw(
                'CALL delete_page_edits_of_deleted_page(?)', [pageId]
            );
            return deletedPageEdits;
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

module.exports = PageEditDAO;