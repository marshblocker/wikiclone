const shortid = require('shortid');

const utils = require('../../utils');
let users = require('../../database/usersDatabase');

let userCreateController = {
    createUser: function(req, res) {
        const requiredParams = ['username', 'password', 'email', 'role'];
        const validateRes = utils.validateUserRequiredParams(requiredParams, req.body, req.method, null);
        if (validateRes !== true) {
            return res.status(validateRes.error.code).json(validateRes.error);
        }
        
        const user_id = shortid.generate();
        const newUser = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            role: req.body.role,
            contributed_pages: [],
            page_action_requests: []
        };
        users[user_id] = newUser;

        return res.status(200).json(req.body);
    }
};

module.exports = userCreateController;