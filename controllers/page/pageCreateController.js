const shortid = require('shortid');

const utils = require('../../utils');
let pages = require('../../database/pagesDatabase');

let pageCreateController = {
    createPage: function(req, res) {
        const requiredParams = ['title', 'content', 'creator_id'];
        const validateRes = utils.validateUserRequiredParams(requiredParams, req.body, req.method, null);
        if (validateRes !== true) {
            return res.status(validateRes.error.code).json(validateRes.error);
        }
        
        const page_id = shortid.generate();
        const newPage = {
            title: req.body.title,
            content: req.body.content,
            version: 1,
            contributors: [req.body.creator_id]
        };
        pages[page_id] = newPage;

        return res.status(200).json(req.body);
    }
};

module.exports = pageCreateController;