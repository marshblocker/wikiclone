const CustomError = require('../../error');
const shortid = require('shortid');
const utils = require('../../utils');

class UserCreateController {
    constructor(userDAO) {
        this.userDAO = userDAO;
    }

    async createUser(req, res) {
        try {
            const userId = shortid.generate();
            let info = req.body['info'];
            if (!userId) {
                throw CustomError.MissingRequiredURLParamAttr('user_id');
            }
            utils.checkUserInfo(info);

            const hash = await utils.hashPassword(info['password']);

            // We only store the hash of the password, not the password itself.
            info['passwordHash'] = hash;
            delete info['password'];

            const result = await this._createUser(userId, info);
            let newUserInfo = result[0][0][0];
            newUserInfo['can_edit'] = (newUserInfo['can_edit'] === 1) ? true : false;
            return res.status(200).json({ "info": newUserInfo });
        } catch (error) {
            if (error.code) {
                return res.status(error.code).json({ 
                    custom_code: error.custom_code, 
                    message: error.message 
                });
            } else {
                console.log(error);
                return res.status(500).json(error);
            }
        }
    }

    async _createUser(userId, info) {
        try {
            return await this.userDAO.createUser(userId, info);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserCreateController;