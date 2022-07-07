const CustomError = require('../../error');
const utils = require('../../utils');

class PageEditDeleteController {
    constructor(pageEditDAO) {
        this.pageEditDAO = pageEditDAO;
    }

    async deletePageEdit(req, res) {
        try {
            if (!req.parsedToken || req.parsedToken.role === 'user' || !req.parsedToken.canEdit) {
                throw CustomError.ForbidDeletePage();
            }
    
            const pageEditId = req.params['page_edit_id'];
            if (!pageEditId) {
                throw CustomError.MissingRequiredURLParamAttr('page_edit_id');
            }
    
            const result = await this._deletePageEdit(pageEditId);
            let deletedPageEdit = result[0][0][0];
            deletedPageEdit['freeze_page'] = (deletedPageEdit['freeze_page'] === 1) ? true : false;
    
            const formattedDeletedPageEdit = utils.formatPageContent(deletedPageEdit)
            
            return res.status(200).json(formattedDeletedPageEdit);
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

    async _deletePageEdit(pageEditId) {
        try {
            return await this.pageEditDAO.deletePageEdit(pageEditId);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PageEditDeleteController;