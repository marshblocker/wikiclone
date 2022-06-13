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
        
        const validateRes = utils.validatePageRequiredParams([attr], req.body, req.method, req.params.page_id);
        if (validateRes !== true) {
            return res.status(validateRes.error.code).json(validateRes.error);
        }
        
        if (attr === 'contributors') {
            if (req.query.user_id === undefined) {
                const error = {
                    code: 400,
                    message: 'user_id not included as query parameter.'
                }
                return res.status(error.code).json(error);
            }

            let pageContributorsArray = pages[req.params.page_id]['contributors']; 
            if (pageContributorsArray.includes(req.query.user_id)) {
                const error = {
                    code: 400,
                    message: "The page's contributors attribute already contain the provided user_id!"
                };
                return res.status(error.code).json(error);
            }

            const usersIDs = Object.keys(users);
            const userIDExists = usersIDs.some(userID => userID === req.query.user_id);
            if (!userIDExists) {
                const error = {
                    code: 404,
                    message: 'The given user_id does not refer to any existing users.'
                };
                return res.status(error.code).json(error);
            }

            if (!twoArraysAreEqual(req.body.contributors, pageContributorsArray)) {
                const error = {
                    code: 400,
                    message: "The given contributors parameter does not match with the user's contributors attribute."
                };
                return res.status(error.code).json(error);
            }
                
            pageContributorsArray.push(req.body.user_id);
            return res.status(200).json({ contributors: pageContributorsArray });
        } else {
            pages[req.params.page_id][attr] = req.body[attr];
            return res.status(200).json(req.body);
        }

    }
};

function getAttributeToUpdate(requestBody) {
    let attributeToUpdate = '';
    if (requestBody.title) attributeToUpdate = 'title';
    else if (requestBody.content) attributeToUpdate = 'content';
    else if (requestBody.version) attributeToUpdate = 'version';
    else if (requestBody.contributors) attributeToUpdate = 'contributors';

    return attributeToUpdate;
}

module.exports = pageUpdateController;