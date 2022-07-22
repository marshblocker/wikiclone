const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constants = require('../../constants');
const CustomError = require('../../error');

const UserDAO = require('../../DAO/UserDAO');
const userDAO = new UserDAO();


class LoginController {
    constructor(userReadController) {
        this.userReadController = userReadController;
    }

    async loginUser(req, res) {
        try {
            const credentials = req.body.credentials;
            const username = credentials['username'];
            const email = credentials['email'];
            const password = credentials['password'];

            if ((username === null && email === null) || password === null) {
                throw CustomError.IncompleteCredentials();
            }

            let userInfo;
            if (username) {
                userInfo = await userDAO
                    .readUserInfoWithMatchingUsername(username);
            } else {
                userInfo = await userDAO
                    .readUserInfoWithMatchingEmail(email);
            }

            if (userInfo == undefined) {
                throw CustomError.UserDoesNotExist();
            }

            const userAlreadyLoggedIn = await userDAO.checkUserAlreadyLoggedIn(userInfo['username']);
            if (userAlreadyLoggedIn) {
                throw CustomError.UserAlreadyLoggedIn();
            }

            const passwordHash = (await this.userReadController
                ._readUserPasswordHash(userInfo['user_id']))[0][0][0]['password_hash'];

            const isCorrectPassword = await bcrypt.compare(password, passwordHash);
            if (!isCorrectPassword) {
                throw CustomError.WrongPassword();
            }

            const userCredentials = {
                userId: userInfo['user_id'],
                username: userInfo['username'],
                email: userInfo['email'],
                role: userInfo['role'],
                canEdit: (+userInfo['can_edit'] === 1) ? true : false
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