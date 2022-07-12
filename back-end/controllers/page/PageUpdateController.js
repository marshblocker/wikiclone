const CustomError = require('../../error');
const utils = require('../../utils');
const PageDAO = require('../../DAO/PageDAO');
const PageEditDAO = require('../../DAO/PageEditDAO');
const PageReadController = require('./PageReadController');

const pageEditDAO = new PageEditDAO();
const pageReadController = new PageReadController(new PageDAO());

class PageUpdateController {
    constructor(pageDAO) {
        this.pageDAO = pageDAO;
    }

    async updateContent(req, res) {
        try {
            if (!req.parsedToken) {
                throw CustomError.NoJWTPassed();
            }
            if (!req.parsedToken.canEdit) {
                throw CustomError.ForbidEditPage();
            }
            const pageId = req.params['page_id'];
            const username = req.parsedToken.username;
            const userId = req.parsedToken.userId;
            let freezePage = (await pageReadController._readPage(pageId));
            freezePage = (freezePage[0][0][0]['freeze_page'] === 1) ? true : false;
            if (freezePage) {
                throw CustomError.ForbidEditPage();
            }

            let content = req.body['content'];
            if (!pageId) {
                throw CustomError.MissingRequiredURLParamAttr('page_id');
            }
            utils.checkPageContent(content);

            // To comply with JS naming convention.
            content.imageUrl = content.image_url;
            delete content.image_url;

            const result = await this._updateContent(pageId, username, userId, content);
            let updatedPage = result[0][0][0];
            updatedPage['freeze_page'] = (updatedPage['freeze_page'] === 1) ? true : false;
            
            await pageEditDAO.updateCurrentTitle(pageId, updatedPage['current_title']);
            
            const formattedUpdatedPage = utils.formatPageContent(updatedPage);

            return res.status(200).json(formattedUpdatedPage);
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

    async _updateContent(pageId, username, userId, content) {
        try {
            return await this.pageDAO.updateContent(pageId, username, userId, content);
        } catch (error) {
            throw error;
        }
    }

    async updateFreezePage(req, res) {
        try {
            if (!req.parsedToken) {
                throw CustomError.NoJWTPassed();
            }
            if (req.parsedToken.role === 'user' || !req.parsedToken.canEdit) {
                throw CustomError.ForbidFreezePage();
            }

            const pageId = req.params['page_id'];
            const username = req.parsedToken.username;
            const userId = req.parsedToken.userId;
            const freezePage = req.body['freeze_page'];
            if (!pageId) {
                throw CustomError.MissingRequiredURLParamAttr('page_id');
            }
            if (freezePage === undefined || freezePage === null) {
                throw CustomError.AttributeNotDefined('freeze_page');
            }
    
            const result = await this._updateFreezePage(pageId, username, userId, freezePage);
            let updatedPage = result[0][0][0];
            updatedPage['freeze_page'] = (updatedPage['freeze_page'] === 1) ? true : false;

            const formattedUpdatedPage = utils.formatPageContent(updatedPage);
    
            return res.status(200).json(formattedUpdatedPage);
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

    async _updateFreezePage(pageId, username, userId, freezePage) {
        try {
            return await this.pageDAO.updateFreezePage(pageId, username, userId, freezePage);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PageUpdateController;