const CustomError = require('../../error');
const utils = require('../../utils');

const PageEditDAO = require('../../DAO/PageEditDAO');
const pageEditDAO = new PageEditDAO();

class PageDeleteController {
    constructor(pageDAO) {
        this.pageDAO = pageDAO;
    }

    async deletePage(req, res) {
        try {
            if (!req.parsedToken) {
                throw CustomError.NoJWTPassed();
            }
            if (req.parsedToken.role === 'user' || !req.parsedToken.canEdit) {
                throw CustomError.ForbidDeletePage();
            }

            const pageId = req.params['page_id'];
            if (!pageId) {
                throw CustomError.MissingRequiredURLParamAttr('page_id');
            }

            const result = await this._deletePage(pageId);
            await pageEditDAO.deletePageEditsOfDeletedPage(pageId);

            let deletedPage = result[0][0][0];
            deletedPage['freeze_page'] = (deletedPage['freeze_page'] === 1) ? true : false;

            const formattedDeletedPage = utils.formatPageContent(deletedPage)
            
            return res.status(200).json(formattedDeletedPage);
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

    async _deletePage(pageId) {
        try {
            return await this.pageDAO.deletePage(pageId);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PageDeleteController