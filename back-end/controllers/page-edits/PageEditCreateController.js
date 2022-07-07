const CustomError = require('../../error');
const utils = require('../../utils');
const { nanoid } = require('nanoid');

class PageEditCreateController {
    constructor(pageEditDAO) {
        this.pageEditDAO = pageEditDAO;
    }

    async createPageEdit(req, res) {
        try {
            if (!req.parsedToken || !req.parsedToken.canEdit) {
                throw CustomError.ForbidCreatePage();
            }

            const pageEditId = nanoid(9);
            console.log(pageEditId);
            const pageVersion = req.body['page_version'];
            const timestamp = req.body['timestamp'];
            const editSummary = req.body['edit_summary'];
            const userId = req.parsedToken.userId;
            const username = req.parsedToken.username;
            const role = req.parsedToken.role;
            const pageId = req.body['page_id'];
            const freezePage = req.body['freeze_page'];
            const content = req.body['content'];

            if (!pageEditId) {
                throw CustomError.MissingRequiredURLParamAttr('page_edit_id');
            }
            if (!pageId) {
                throw CustomError.MissingRequiredURLParamAttr('page_id');
            }
            if (!userId) {
                throw CustomError.MissingRequiredURLParamAttr('user_id');
            }
            utils.checkUserInfo({ 
                'username': username, 'role': role 
            });
            utils.checkPageContent(content);
            utils.checkPageMetaContent({
                'page_version': pageVersion, 
                'timestamp': timestamp, 
                'edit_summary': editSummary,
                'freeze_page': freezePage
            });

            // To comply with JS naming convention.
            content.imageUrl = content.image_url;
            delete content.image_url;

            const result = await this._createPageEdit(
                pageEditId, pageVersion, timestamp, editSummary,
                userId, username, role, pageId, freezePage, content
            );
            let newPageEdit = result[0][0][0];
            newPageEdit['freeze_page'] = (newPageEdit['freeze_page'] === 1) ? true : false;

            const formattedNewPageEdit = utils.formatPageContent(newPageEdit);

            return res.status(200).json(formattedNewPageEdit);
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

    async _createPageEdit(pageEditId, pageVersion, timestamp, 
                          editSummary, userId, username, 
                          role, pageId, freezePage, content) {
        try {
            return await this.pageEditDAO.createPageEdit(
                pageEditId, pageVersion, timestamp, editSummary, 
                userId, username, role, pageId, freezePage, content
            );
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PageEditCreateController;