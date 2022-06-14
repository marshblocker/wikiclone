const shortid = require('shortid');

const utils = require('../../utils');
let users = require('../../database/usersDatabase');

let userCreateController = {
    createUser: function(req, res) {
        const requiredParams = ['username', 'password', 'email', 'role'];
        const validateRes = utils.validateUserRequiredParams(requiredParams, req.body, req.method, null);
        if (validateRes !== 'valid') {
            return res.status(validateRes.error.code).json(validateRes.error);
        }
        
        const user_id = shortid.generate();
        const newUser = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            role: req.body.role,
            can_edit: true,
        };
        users[user_id] = newUser;

        return res.status(200).json(req.body);
    }
};

module.exports = userCreateController;