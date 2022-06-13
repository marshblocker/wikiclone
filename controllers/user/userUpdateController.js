const utils = require('../../utils');
let users = require('../../database/usersDatabase');

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
        
        if (attr === 'page_id') {
            if (users[req.params.user_id]['contributed_pages'].includes(req.body.page_id)) {
                const error = {
                    code: 400,
                    message: "The user's contributed_pages attribute already contain the provided page_id!"
                };
                return res.status(error.code).json(error);
            } else {
                users[req.params.user_id]['contributed_pages'].push(req.body.page_id);
            }
        } else {
            users[req.params.user_id][attr] = req.body[attr];
        }

        return res.status(200).json(req.body);
    }
};

function getAttributeToUpdate(requestBody) {
    let attributeToUpdate = '';
    if (requestBody.username) attributeToUpdate = 'username';
    else if (requestBody.password) attributeToUpdate = 'password';
    else if (requestBody.email) attributeToUpdate = 'email';
    else if (requestBody.role) attributeToUpdate = 'role';
    else if (requestBody.page_id) attributeToUpdate = 'page_id';

    return attributeToUpdate;
}

module.exports = userUpdateController;