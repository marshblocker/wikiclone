const utils = require('../../utils');
let users = require('../../database/usersDatabase');

let userDeleteController = {
    deleteUser: function(req, res) {
        if (users[req.params.user_id] === undefined) {
            const error = {
                code: 404,
                message: 'The given user does not exist!'
            };
            return res.status(error.code).json(error);
        }

        const requiredParams = [];
        const validateRes = utils.validateUserRequiredParams(requiredParams, req.body, req.method, null);
        if (validateRes !== 'valid') {
            return res.status(validateRes.error.code).json(validateRes.error);
        }

        let user = JSON.parse(JSON.stringify(users[req.params.user_id]));
        delete user.password;

        delete users[req.params.user_id];
        return res.status(200).json(user);
    }
};

module.exports = userDeleteController;