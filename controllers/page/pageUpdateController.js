const utils = require('../../utils');
let pages = require('../../database/pagesDatabase');

let pageUpdateController = {
    updatePage: function(req, res) {
        if (pages[req.params.page_id] === undefined) {
            const error = {
                code: 400,
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
        
        const validateRes = utils.validatePageRequiredParams([attr], req.body, req.method, req.params.page_id);
        if (validateRes !== true) {
            return res.status(validateRes.error.code).json(validateRes.error);
        }
        
        if (attr === 'user_id') {
            if (pages[req.params.page_id]['contributors'].includes(req.body.user_id)) {
                const error = {
                    code: 400,
                    message: "The page's contributors attribute already contain the provided user_id!"
                };
                return res.status(error.code).json(error);
            } else {
                pages[req.params.page_id]['contributors'].push(req.body.user_id);
            }
        } else {
            pages[req.params.page_id][attr] = req.body[attr];
        }

        return res.status(200).json(req.body);
    }
};

function getAttributeToUpdate(requestBody) {
    let attributeToUpdate = '';
    if (requestBody.title) attributeToUpdate = 'title';
    else if (requestBody.content) attributeToUpdate = 'content';
    else if (requestBody.version) attributeToUpdate = 'version';
    else if (requestBody.user_id) attributeToUpdate = 'user_id';

    return attributeToUpdate;
}

module.exports = pageUpdateController;