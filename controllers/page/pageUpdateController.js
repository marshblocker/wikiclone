const utils = require('../../utils');
let pages = require('../../database/pagesDatabase');
let users = require('../../database/usersDatabase');

let pageUpdateController = {
    updatePage: function(req, res) {
        if (pages[req.params.page_id] === undefined) {
            const error = {
                code: 404,
                message: 'The given page does not exist!'
            };
            return res.status(error.code).json(error);
        }

        const attr = getAttributeToUpdate(req.body);
        if (!attr) {
            const error = {
                code: 400,
                message: 'No attribute specified.'
            };
            return res.status(error.code).json(error);
        }
        
        let validateRes = utils.validatePageRequiredParams([attr, 'user_id'], req.body, req.method, req.params.page_id);
        if (validateRes !== 'valid') {
            return res.status(validateRes.error.code).json(validateRes.error);
        }

        validateRes = utils.validateSenderUserID(req, users);
        if (validateRes !== 'valid') {
            return res.status(validateRes.error.code).json(validateRes.error);
        }

        if (attr === 'freeze_page' && users[req.body.user_id].role === 'user') {
            const error = {
                code: 403,
                message: 'Only an admin or a superadmin can freeze a page.'
            };
            return res.status(error.code).json(error);
        }

        if (['title', 'content'].includes(attr)) {
            if (!users[req.body.user_id].can_edit) {
                const error = {
                    code: 403,
                    message: 'The user is not allowed to edit a page.'
                };
                return res.status(error.code).json(error);
            }
            if (pages[req.params.page_id].freeze_page) {
                const error = {
                    code: 405,
                    message: 'The page is restricted from being edited.'
                }
                return res.status(error.code).json(error);
            }
        }
        
        pages[req.params.page_id][attr] = req.body[attr];
        return res.status(200).json(req.body);
    }
};

function getAttributeToUpdate(requestBody) {
    let attributeToUpdate = '';
    if (requestBody.title !== undefined) attributeToUpdate = 'title';
    else if (requestBody.content !== undefined) attributeToUpdate = 'content';
    else if (requestBody.freeze_page !== undefined) attributeToUpdate = 'freeze_page';

    return attributeToUpdate;
}

module.exports = pageUpdateController;