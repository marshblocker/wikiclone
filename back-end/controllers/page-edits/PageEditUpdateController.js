const CustomError = require('../../error');
const utils = require('../../utils');

class PageEditUpdateController {
    constructor(pageEditDAO) {
        this.pageEditDAO = pageEditDAO;
    }

    async updateEditSummary(req, res) {
        try {
            if (!req.parsedToken) {
                throw CustomError.NoJWTPassed();
            }
            if (!req.parsedToken.canEdit) {
                throw CustomError.ForbidEditPage();
            }
            const pageEditId = req.params['page_edit_id'];
            const editSummary = req.body['edit_summary'];
            if (!pageEditId) {
                throw CustomError.MissingRequiredURLParamAttr('page_edit_id');
            }
            utils.checkEditSummary(editSummary);
    
            const result = await this._updateEditSummary(pageEditId, editSummary);
            const updatedEditSummary = result[0][0][0];
    
            return res.status(200).json(updatedEditSummary);
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

    async _updateEditSummary(pageEditId, editSummary) {
        try {
            return await this.pageEditDAO.updateEditSummary(pageEditId, editSummary);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PageEditUpdateController;