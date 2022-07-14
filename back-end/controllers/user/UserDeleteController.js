const CustomError = require('../../error');

class UserDeleteController {
    constructor(userDAO) {
        this.userDAO = userDAO;
    }

    async deleteUser(req, res) {
        try {
            const username = req.params['username'];
            if (!username) {
                throw CustomError.MissingRequiredURLParamAttr('user_id');
            }

            const result = await this._deleteUser(username);
            let info = result[0][0][0];
            info['can_edit'] = (+info['can_edit'] === 1) ? true : false;
            return res.status(200).json({ "info": info });
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

    async _deleteUser(username) {
        try {
            return await this.userDAO.deleteUser(username);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserDeleteController