const utils = require('../../utils');
let users = require('../../database/usersDatabase');
let pages = require('../../database/pagesDatabase');

let userUpdateController = {
    updateUser: function(req, res) {
        if (users[req.params.user_id] === undefined) {
            const error = {
                code: 400,
                message: 'The given user does not exist!'
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
        
        const validateRes = utils.validateUserRequiredParams([attr], req.body, req.method, req.params.user_id);
        if (validateRes !== true) {
            return res.status(validateRes.error.code).json(validateRes.error);
        }
        
        if (attr === 'contributed_pages') {
            if (req.query.page_id === undefined) {
                const error = {
                    code: 400,
                    message: 'page_id not included as query parameter.'
                }
                return res.status(error.code).json(error);
            }

            let userContributionArray = users[req.params.user_id]['contributed_pages']; 
            if (userContributionArray.includes(req.query.page_id)) {
                const error = {
                    code: 400,
                    message: "The user's contributed_pages attribute already contain the provided page_id!"
                };
                return res.status(error.code).json(error);
            }

            const pagesIDs = Object.keys(pages);
            const pageIDExists = pagesIDs.some(pageID => pageID === req.query.page_id);
            if (!pageIDExists) {
                const error = {
                    code: 404,
                    message: 'The given page_id does not refer to any existing pages.'
                };
                return res.status(error.code).json(error);
            }

            if (!twoArraysAreEqual(req.body.contributed_pages, userContributionArray)) {
                const error = {
                    code: 400,
                    message: "The given contributed_pages parameter does not match with the user's contributed_pages attribute."
                };
                return res.status(error.code).json(error);
            }
                
            userContributionArray.push(req.query.page_id);
            return res.status(200).json({contributed_pages: userContributionArray});
        } else {
            users[req.params.user_id][attr] = req.body[attr];
            return res.status(200).json(req.body);
        }
    }
};

function getAttributeToUpdate(requestBody) {
    let attributeToUpdate = '';
    if (requestBody.username) attributeToUpdate = 'username';
    else if (requestBody.password) attributeToUpdate = 'password';
    else if (requestBody.email) attributeToUpdate = 'email';
    else if (requestBody.role) attributeToUpdate = 'role';
    else if (requestBody.contributed_pages) attributeToUpdate = 'contributed_pages';

    return attributeToUpdate;
}

function twoArraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((val, indx) => val === arr2[indx]);
}

module.exports = userUpdateController;