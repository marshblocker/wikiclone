const utils = require('../../utils');
let users = require('../../database/usersDatabase');

let userReadController = {
    // TODO: Pagination and filtering.
    readUsers: function(req, res) {
        const requiredParams = [];
        const validateRes = utils.validateUserRequiredParams(requiredParams, req.body, req.method, null);
        if (validateRes !== true) {
            return res.status(validateRes.error.code).json(validateRes.error);
        }        

        let usersRead = {};
        let usersIDs = Object.keys(users); 
        for (let i = 0; i < usersIDs.length; i++) {
            let user = JSON.parse(JSON.stringify(users[usersIDs[i]]));
            delete user.password;
            usersRead[usersIDs[i]] = user;
        }
    
        return res.status(200).json(usersRead);
    },

    readUser: function(req, res) {
        if (users[req.params.user_id] === undefined) {
            const error = {
                code: 400,
                message: 'The given user does not exist!'
            };
            return res.status(error.code).json(error);
        }

        const requiredParams = [];
        const validateRes = utils.validateUserRequiredParams(requiredParams, req.body, req.method, null);
        if (validateRes !== true) {
            return res.status(validateRes.error.code).json(validateRes.error);
        }

        if (Object.keys(req.query).length) {
            const attr = req.query.attr;
            const val = users[req.params.user_id][attr];
            if (val === undefined) {
                const error = {
                    code: 400,
                    message: 'User does not have the given attribute.'
                };
                return res.status(error.code).json(error);
            } else {
                const request = {};
                request[attr] = val;
                return res.status(200).json(request);
            }
        }
        
        let user = JSON.parse(JSON.stringify(users[req.params.user_id]));
        delete user.password;
        return res.status(200).json(user);
    }
};

module.exports = userReadController;