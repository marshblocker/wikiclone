const CustomError = require('../../error');
const utils = require('../../utils');
const PageDAO = require('../../DAO/PageDAO');
const PageReadController = require('./PageReadController');

const pageReadController = new PageReadController(new PageDAO());

class PageUpdateController {
    constructor(pageDAO) {
        this.pageDAO = pageDAO;
    }

    async updateContent(req, res) {
        try {
            // if (!req.parsedToken || !req.parsedToken.canEdit) {
            //     throw CustomError.ForbidEditPage();
            // }
            const pageId = req.params['page_id'];
            let freezePage = (await pageReadController._readPage(pageId));
            freezePage = freezePage[0][0][0]['freeze_page'];
            console.log(freezePage);
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

            const result = await this._updateContent(pageId, content);
            let updatedPage = result[0][0][0];

            // This is the expected response format.
            updatedPage = {
                page_id: updatedPage.page_id,
                freeze_page: updatedPage.freeze_page,
                content: {
                    title: updatedPage.title,
                    image_url: updatedPage.image_url,
                    lead: updatedPage.lead,
                    body: updatedPage.body
                }
            };
            return res.status(200).json(updatedPage);
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

    async _updateContent(pageId, content) {
        try {
            return await this.pageDAO.updateContent(pageId, content);
        } catch (error) {
            throw error;
        }
    }

    async updateFreezePage(req, res) {
        try {
            // if (!req.parsedToken || req.parsedToken.role === 'user' || !req.parsedToken.canEdit) {
            //     throw CustomError.ForbidFreezePage();
            // }

            const pageId = req.params['page_id'];
            const freezePage = req.body['freeze_page'];
            if (!pageId) {
                throw CustomError.MissingRequiredURLParamAttr('page_id');
            }
            if (freezePage === undefined || freezePage === null) {
                throw CustomError.AttributeNotDefined('freeze_page');
            }
    
            const result = await this._updateFreezePage(pageId, freezePage);
            let updatedFreezePage = { 
                "freeze_page": ((result[0][0][0]['freeze_page'] === 1) ? true : false) 
            };
            return res.status(200).json(updatedFreezePage);
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

    async _updateFreezePage(pageId, freezePage) {
        try {
            return await this.pageDAO.updateFreezePage(pageId, freezePage);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PageUpdateController;