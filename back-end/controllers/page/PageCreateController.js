// TODO: validate content in createPage and updateContent.

const shortid = require('shortid');

const CustomError = require('../../error');
const utils = require('../../utils');

class PageCreateController {
    constructor(pageDAO) {
        this.pageDAO = pageDAO;
    }

    async createPage(req, res) {
        try {
            if (!req.parsedToken) {
                throw CustomError.NoJWTPassed();
            }
            if (!req.parsedToken.canEdit) {
                throw CustomError.ForbidCreatePage();
            }

            const pageId = shortid.generate();
            const username = req.parsedToken.username;
            const userId = req.parsedToken.userId;
            const content = req.body['content'];
            if (!pageId) {
                throw CustomError.MissingRequiredURLParamAttr('page_id');
            }
            utils.checkUserInfo({ 'username': username });
            utils.checkPageContent(content);

            // To comply with JS naming convention.
            content.imageUrl = content.image_url;
            delete content.image_url;

            const result = await this._createPage(pageId, username, userId, content);
            let newPage = result[0][0][0];
            newPage['freeze_page'] = (newPage['freeze_page'] === 1) ? true : false;

            const formattedNewPage = utils.formatPageContent(newPage);

            return res.status(200).json(formattedNewPage);
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

    async _createPage(pageId, username, userId, content) {
        try {
            return await this.pageDAO.createPage(pageId, username, userId,  content);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PageCreateController;