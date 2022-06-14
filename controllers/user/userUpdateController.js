const utils = require('../../utils');
let users = require('../../database/usersDatabase');

let userUpdateController = {
    updateUser: function(req, res) {
        if (users[req.params.user_id] === undefined) {
            const error = {
                code: 404,
                message: 'The given user does not exist!'
            };
            return res.status(error.code).json(error);
        }

        const attr = getAttributeToUpdate(req.body);
        console.log(req.body);
        if (!attr) {
            const error = {
                code: 400,
                message: 'No attribute specified.'
            };
            return res.status(error.code).json(error);
        }
        
        let validateRes = utils.validateUserRequiredParams([attr, 'user_id'], req.body, req.method, req.params.user_id);
        if (validateRes !== 'valid') {
            return res.status(validateRes.error.code).json(validateRes.error);
        }

        validateRes = utils.validateSenderUserID(req, users);
        if (validateRes !== 'valid') {
            return res.status(validateRes.error.code).json(validateRes.error);
        }
        
        if (attr === 'can_edit') {
            validateRes = validateCanEditAttribute(req);
            if (validateRes !== 'valid') {
                return res.status(validateRes.error.code).json(validateRes.error);
            }
        }  
        else if (attr === 'role') {
            validateRes = validateRoleAttribute(req);
            if (validateRes !== 'valid') {
                return res.status(validateRes.error.code).json(validateRes.error);
            }
        }
        else if (['username', 'password', 'email'].includes(attr)) {
            if (req.params.user_id !== req.body.user_id) {
                const error = {
                    code: 403,
                    message: "The personal information of a user (username, password, email) can only be changed by the user itself."
                };
                return res.status(error.code).json(error);
            }
        }

        users[req.params.user_id][attr] = req.body[attr];
        return res.status(200).json(req.body);
    }
};

function getAttributeToUpdate(requestBody) {
    let attributeToUpdate = '';
    if (requestBody.username !== undefined) attributeToUpdate = 'username';
    else if (requestBody.password !== undefined) attributeToUpdate = 'password';
    else if (requestBody.email !== undefined) attributeToUpdate = 'email';
    else if (requestBody.role !== undefined) attributeToUpdate = 'role';
    else if (requestBody.can_edit !== undefined) attributeToUpdate = 'can_edit';

    return attributeToUpdate;
}

function validateCanEditAttribute(req) {
    let code;
    let message = ''
    if (users[req.body.user_id].role === 'user') {
        code = 403;
        message = "Only an admin or a superadmin can update the 'can_edit' attribute of a user.";
    }
    else if (users[req.body.user_id].role === 'admin' && users[req.params.user_id].role !== 'user') {
        code = 403;
        message = "An admin cannot change the 'can_edit' attribute of another admin or a superadmin.";
    }
    else if (users[req.body.user_id].role === 'superadmin' && users[req.params.user_id].role === 'superadmin') {
        code = 403;
        message = "A superadmin cannot change the 'can_edit' attribute of a superadmin.";
    }

    if (message) {
        const error = { "code": code, "message": message };
        return { error };
    }

    return 'valid';
}

function validateRoleAttribute(req) {
    let code;
    let message = '';
    if (users[req.body.user_id].role !== 'superadmin') {
        code = 403;
        message = "Only a superadmin can change the role of another user.";
    }
    else if (users[req.params.user_id].role === 'superadmin') {
        code = 403;
        message = "A superadmin cannot change the role of another superadmin.";
    }
    else if (req.body.role === 'superadmin') {
        code = 400;
        message = "Invalid role parameter value. Allowed values: 'user', 'admin'.";
    }

    if (message) {
        const error = { "code": code, "message": message };
        return { error }
    }

    return 'valid';
}

module.exports = userUpdateController;