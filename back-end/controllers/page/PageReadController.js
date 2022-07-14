const CustomError = require('../../error');
const utils = require('../../utils');

class PageReadController {
    constructor(pageDAO) {
        this.pageDAO = pageDAO;
    }

    async readPage(req, res) {
        try {
            const pageId = req.params['page_id'];
            if (!pageId) {
                throw CustomError.MissingRequiredURLParamAttr('page_id');
            }

            const result = await this._readPage(pageId);
            let page = result[0][0][0];
            page['freeze_page'] = (page['freeze_page'] === 1) ? true : false;

            const formattedPage = utils.formatPageContent(page);

            return res.status(200).json(formattedPage);
        } catch (error) {
            if (error.code) {
                return res.status(error.code).json({ 
                    custom_code: error.custom_code, 
                    message: error.message 
                });
            } else {
                console.log(error);
                return res.status(500).json(error);
            }
        }
    }

    async _readPage(pageId) {
        try {
            return await this.pageDAO.readPage(pageId);
        } catch (error) {
            throw error;
        }
    }

    async readAllPages(req, res) {
        try {
            const searchString = req.query['contains'];
            const title = req.query['title'];
            let result;
            let pages;
            if (searchString) {
                const offset = req.query['offset'];
                const limit = req.query['limit'];
                if (!offset || !limit) {
                    throw CustomError.MissingRequiredURLQueryAttr('offset or limit');
                }
                result = await this._readPagesBasedOnSearchString(searchString, offset, limit);
                pages = result[0][0];
            } else if (title) {
                result = await this._readPageBasedOnTitle(title);
                let page = result[0][0][0];
                page = utils.formatPageContent(page);
                page['freeze_page'] = (page['freeze_page'] === 1) ? true : false;
                return res.status(200).json(page);
            } else {
                const offset = req.query['offset'];
                const limit = req.query['limit'];
                if (!offset || !limit) {
                    throw CustomError.MissingRequiredURLQueryAttr('offset or limit');
                }
                result = await this._readAllPages(offset, limit);
                pages = result[0][0];
                for (let i = 0; i < pages.length; i++) {
                    pages[i]['freeze_page'] = (pages[i]['freeze_page'] === 1) ? true : false; 
    
                    // This is the expected response format.
                    pages[i].content = {
                        title: pages[i].title,
                        image_url: pages[i].image_url,
                        lead: pages[i].lead,
                        body: pages[i].body
                    };
                    delete pages[i].title;
                    delete pages[i].image_url;
                    delete pages[i].lead;
                    delete pages[i].body;
                }
            }
            return res.status(200).json(pages);
        } catch (error) {
            if (error.code) {
                return res.status(error.code).json({ 
                    custom_code: error.custom_code, 
                    message: error.message 
                });
            } else {
                console.log(error);
                return res.status(500).json(error);
            }
        }
    }

    async _readAllPages(offset, limit) {
        try {
            return await this.pageDAO.readAllPages(offset, limit);
        } catch (error) {
            throw error;
        }
    }

    async _readPagesBasedOnSearchString(searchString, offset, limit) {
        try {
            return await this.pageDAO.readPagesBasedOnSearchString(searchString, offset, limit);
        } catch (error) {
            throw error;
        }
    }

    async _readPageBasedOnTitle(title) {
        try {
            return await this.pageDAO.readPageBasedOnTitle(title);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PageReadController;