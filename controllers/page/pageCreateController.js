const shortid = require('shortid');

const utils = require('../../utils');
let pages = require('../../database/pagesDatabase');
let users = require('../../database/usersDatabase');

let pageCreateController = {
    createPage: function(req, res) {
        const requiredParams = ['title', 'content', 'user_id'];
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
                message: 'The user is not allowed to create a new page.'
            };
            return res.status(error.code).json(error);
        }
        
        const page_id = shortid.generate();
        const newPage = {
            title: req.body.title,
            content: req.body.content,
            freeze_page: false,
        };
        pages[page_id] = newPage;

        return res.status(200).json(req.body);
    }
};

module.exports = pageCreateController;