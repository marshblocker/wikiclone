// TODO: Validate that when updating, reading, or deleting a page,
//       the page_id exists in the database.

const knex = require('../database/knex');
const redis = require('../database/redis');
const CustomError = require('../error');

class PageDAO {
    async createPage(pageId, username, userId, content) {
        try {
            const { title, imageUrl, lead, body } = content;
            return await knex.raw(
                'CALL create_page(?, ?, ?, ?, ?, ?, ?)',
                [pageId, title, username, userId, imageUrl, lead, body]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async readPage(pageId) {
        try {
            if (await redis.exists(pageId)) {
                console.log('Already cached!');
                let cachedPage = await redis.hgetall(pageId);

                // The triple brackets are needed to match the format 
                // of the returned data via the stored procedure call.
                return [[[cachedPage]]];
            } else {
                console.log('Not cached!');
                let res = await knex.raw(
                    'CALL read_page(?)', [pageId]
                );

                let page = res[0][0][0];
                redis
                    .pipeline()
                    .hset(pageId,
                        'page_version', page['page_version'],
                        'timestamp', page['timestamp'],
                        'username', page['username'],
                        'user_id', page['user_id'],
                        'freeze_page', page['freeze_page'],
                        'title', page['title'],
                        'image_url', page['image_url'],
                        'lead', page['lead'],
                        'body', page['body']
                    )
                    .expire(pageId, 180) // Expires after 3 minutes.
                    .exec((err, results) => {
                        if (err) throw err;
                    })

                return res;
            }
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

    async readPageBasedOnTitle(title) {
        try {
            return await knex.raw(
                'CALL read_page_based_on_title(?)',
                [title]
            );
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async updateContent(pageId, username, userId, content) {
        try {
            const { title, imageUrl, lead, body } = content;
            let res = await knex.raw(
                'CALL update_content(?, ?, ?, ?, ?, ?, ?)',
                [pageId, username, userId, title, imageUrl, lead, body]
            );
            await redis.del(pageId);
            return res;
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async updateFreezePage(pageId, username, userId, freezePage) {
        try {
            let res = await knex.raw(
                'CALL update_freeze_page(?, ?, ?, ?)',
                [pageId, username, userId, freezePage]
            );
            await redis.del(pageId);
            return res;
        } catch (error) {
            throw this._handleDBError(error);
        }
    }

    async updateUsername(userId, username) {
        try {
            let res = await knex.raw(
                'CALL update_username_in_pages(?, ?)',
                [userId, username]
            );

            let pageIds = [];
            for (let i = 0; i < res[0][0].length; i++) {
                pageIds.push(res[0][0][i]['page_id']);
            }
            if (pageIds.length > 0) {
            await redis.del(...pageIds);
            }

            return res;
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
            await redis.del(pageId);
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