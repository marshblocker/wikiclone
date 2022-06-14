const utils = require('../../utils');
let pages = require('../../database/pagesDatabase');
let users = require('../../database/usersDatabase');

let pageDeleteController = {
    deletePage: function(req, res) {
        if (pages[req.params.page_id] === undefined) {
            const error = {
                code: 404,
                message: 'The given page does not exist!'
            };
            return res.status(error.code).json(error);
        }

        const requiredParams = ['user_id'];
        let validateRes = utils.validatePageRequiredParams(requiredParams, req.body, req.method, null);
        if (validateRes !== 'valid') {
            return res.status(validateRes.error.code).json(validateRes.error);
        }

        validateRes = utils.validateSenderUserID(req, users);
        if (validateRes !== 'valid') {
            return res.status(validateRes.error.code).json(validateRes.error);
        }

        if (!users[req.body.user_id].can_edit) {
            const error = {
                code: 403,
                message: 'The user is not allowed to delete the page.'
            };
            return res.status(error.code).json(error);
        }
        
        if (pages[req.params.page_id].freeze_page) {
            const error = {
                code: 405,
                message: 'The page is restricted from being deleted.'
            };
            return res.status(error.code).json(error);
        }

        let page = JSON.parse(JSON.stringify(pages[req.params.page_id]));

        delete pages[req.params.page_id];
        return res.status(200).json(page);
    }
};

module.exports = pageDeleteController;