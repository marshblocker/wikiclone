const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constants = require('../../constants');
const CustomError = require('../../error');


class LoginController {
    constructor(userReadController) {
        this.userReadController = userReadController;
    }

    async loginUser(req, res) {
        try {
            const credentials = req.body.credentials;
            const allUsersInfo = (await this.userReadController._readAllUsersInfo())[0][0];
            let userInfo;
            for (let i = 0; i < allUsersInfo.length; i++) {
                userInfo = allUsersInfo[i];
                if (userInfo['username'] === credentials['usernameOrEmail'] || 
                        userInfo['email'] === credentials['usernameOrEmail']) {
                    break;
                }
            }
            const passwordHash = (await this.userReadController
                ._readUserPasswordHash(userInfo['user_id']))[0][0][0]['password_hash'];

            const correctPassword = await bcrypt.compare(credentials['password'], passwordHash);
            if (!correctPassword) {
                throw CustomError.WrongPassword();
            }

            const userCredentials = {
                userId: userInfo['user_id'],
                username: userInfo['username'],
                email: userInfo['email'],
                role: userInfo['role'],
                canEdit: (userInfo['can_edit'] === 1) ? true : false
            };
            const token = jwt.sign(userCredentials, constants.jwt.ACCESS_TOKEN_SECRET);
            
            return res.status(200).json({ 'token': token });
        } catch (error) {
            return res.status(error.code).json(error.message);
        }
    }

    async _loginUser() {
        try {
            
        } catch (error) {
            throw error;
        }
    }
}

module.exports = LoginController;