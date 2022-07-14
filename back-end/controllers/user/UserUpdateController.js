const CustomError = require('../../error');
const utils = require('../../utils');

const PageDAO = require('../../DAO/PageDAO');
const PageEditDAO = require('../../DAO/PageEditDAO');

const pageDAO = new PageDAO();
const pageEditDAO = new PageEditDAO();

class UserUpdateController {
    constructor(userDAO) {
        this.userDAO = userDAO;
    }

    async updateUserName(req, res) {
        try {
            const userId = req.params['user_id'];
            const username = req.body['username'];
            if (!userId) {
                throw CustomError.MissingRequiredURLParamAttr('user_id');
            }
            utils.checkUserInfo({ 'username': username });

            const result = await this._updateUserName(userId, username);
            await pageDAO.updateUsername(userId, username);
            await pageEditDAO.updateUsername(userId, username);

            let updatedUsername = result[0][0][0];
            return res.status(200).json(updatedUsername);
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

    async _updateUserName(userId, username) {
        try {
            return await this.userDAO.updateUserName(userId, username);
        } catch (error) {
            throw error;
        }
    }

    async updatePassword(req, res) {
        try {
            const userId = req.params['user_id'];
            const password = req.body['password'];
            if (!userId) {
                throw CustomError.MissingRequiredURLParamAttr('user_id');
            }
            utils.checkUserInfo({ 'password': password });

            const hash = await utils.hashPassword(password);

            const result = await this._updatePassword(userId, hash);
            return res.status(200).json(result);
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

    async _updatePassword(userId, hash) {
        try {
            return await this.userDAO.updatePasswordHash(userId, hash);
        } catch (error) {
            throw error;
        }
    }

    async updateEmail(req, res) {
        try {
            const userId = req.params['user_id'];
            const email = req.body['email'];
            if (!userId) {
                throw CustomError.MissingRequiredURLParamAttr('user_id');
            }
            utils.checkUserInfo({ 'email': email });

            const result = await this._updateEmail(userId, email);
            let updatedEmail = result[0][0][0];
            return res.status(200).json(updatedEmail);
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

    async _updateEmail(userId, email) {
        try {
            return await this.userDAO.updateEmail(userId, email);
        } catch (error) {
            throw error;
        }
    }

    async updateRole(req, res) {
        try {
            const userId = req.params['user_id'];
            const role = req.body['role'];
            if (!userId) {
                throw CustomError.MissingRequiredURLParamAttr('user_id');
            }
            utils.checkRole(role);

            const result = await this._updateRole(userId, role);
            await pageEditDAO.updateRole(userId, role);

            let updatedRole = result[0][0][0];
            return res.status(200).json(updatedRole);
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

    async _updateRole(userId, role) {
        try {
            return await this.userDAO.updateRole(userId, role);
        } catch (error) {
            throw error;
        }
    }

    async updateCanEdit(req, res) {
        try {
            const userId = req.params['user_id'];
            const canEdit = req.body['can_edit'];
            if (!userId) {
                throw CustomError.MissingRequiredURLParamAttr('user_id');
            }
            utils.checkCanEdit(canEdit);

            const result = await this._updateCanEdit(userId, canEdit);
            let updatedCanEdit = {
                'can_edit': ((+result[0][0][0]['can_edit'] === 1) ? true : false)
            };
            return res.status(200).json(updatedCanEdit);
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

    async _updateCanEdit(userId, canEdit) {
        try {
            return await this.userDAO.updateCanEdit(userId, canEdit);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserUpdateController;