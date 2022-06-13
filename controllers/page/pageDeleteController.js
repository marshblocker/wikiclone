const utils = require('../../utils');
let pages = require('../../database/pagesDatabase');

let pageDeleteController = {
    deletePage: function(req, res) {
        if (pages[req.params.page_id] === undefined) {
            const error = {
                code: 400,
                message: 'The given page does not exist!'
            };
            return res.status(error.code).json(error);
        }

        const requiredParams = [];
        const validateRes = utils.validateUserRequiredParams(requiredParams, req.body, req.method, null);
        if (validateRes !== true) {
            return res.status(validateRes.error.code).json(validateRes.error);
        }

        let page = JSON.parse(JSON.stringify(pages[req.params.page_id]));

        delete pages[req.params.page_id];
        return res.status(200).json(page);
    }
};

module.exports = pageDeleteController;