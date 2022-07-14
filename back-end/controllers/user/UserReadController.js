const CustomError = require('../../error');
const utils = require('../../utils');

class UserReadController {
    constructor(userDAO) {
        this.userDAO = userDAO;
    }

    async readUserInfo(req, res) {
        try {
            const username = req.params['username'];
            utils.checkUserInfo({'username': username});

            const result = await this._readUserInfo(username);
            let info = result[0][0][0];
            info['can_edit'] = (info['can_edit'] === 1) ? true : false;
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

    async readCurrentUserInfo(req, res) {
        try {
            const username = req.parsedToken['username'];
            if (!username) {
                throw CustomError.NoJWTPassed();
            }

            const result = await this._readUserInfo(username);
            let info = result[0][0][0];
            info['can_edit'] = (info['can_edit'] === 1) ? true : false;
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

    async _readUserInfo(username) {
        try {
            return await this.userDAO.readUserInfo(username);
        } catch (error) {
            throw error;
        }
    }

    async readAllUsersInfo(req, res) {
        try {
            const offset = req.query['offset'];
            const limit = req.query['limit'];
            if (!offset || !limit) {
                throw CustomError.MissingRequiredURLQueryAttr('offset or limit');
            }
            const result = await this._readAllUsersInfo(offset, limit);
            let allUsersInfo = result[0][0];

            for (let i = 0; i < allUsersInfo.length; i++) {
                allUsersInfo[i]['can_edit'] = (allUsersInfo[i]['can_edit'] === 1) ? true : false; 
                allUsersInfo[i] = { "info": allUsersInfo[i] };
            }
            return res.status(200).json(allUsersInfo); 
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

    async _readAllUsersInfo(offset, limit) {
        try {
            return await this.userDAO.readAllUsersInfo(offset, limit);
        } catch (error) {
            throw error;
        }
    }

    async readUserPasswordHash(req, res) {
        try {
            const userId = req.params['user_id'];
            if (!userId) {
                throw CustomError.MissingRequiredURLParamAttr('user_id');
            }

            const result = await this._readUserPasswordHash(userId);
            let passwordHash = result[0][0][0];
            return res.status(200).json(passwordHash);
        } catch (error) {
            if (error.code) {
                return res.status(error.code).json({ 
                    custom_code: error.custom_code, 
                    message: error.message 
                }   );
            } else {
                console.log(error);
                return res.status(500).json(error);
            }
        }
    }

    async _readUserPasswordHash(userId) {
        try {
            return await this.userDAO.readUserPasswordHash(userId);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserReadController;