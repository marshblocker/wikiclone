const CustomError = require('../../error');

class UserDeleteController {
    constructor(userDAO) {
        this.userDAO = userDAO;
    }

    async deleteUser(req, res) {
        try {
            const userId = req.params['user_id'];
            if (!userId) {
                throw CustomError.MissingRequiredURLParamAttr('user_id');
            }

            const result = await this._deleteUser(userId);
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

    async _deleteUser(userId) {
        try {
            return await this.userDAO.deleteUser(userId);
        } catch (error) {
            throw error;
        }
    }

    // deleteUser(req, res) {
    //     this._deleteUser(req.params.user_id)
    //         .then(user => res.status(200).json(user))
    //         .catch(error => res.status(error.code).json(error.message));
    // }

    // _deleteUser(user_id) {
    //     return new Promise((resolve, reject) => {
    //         // Reject the request if user_id is undefined, null, or empty string.
    //         if ([undefined, '', null].includes(user_id)) {
    //             return reject(CustomError.MissingRequiredURLParamAttr('user_id'));
    //         }

    //         // Reject the request if the length of user_id is not equal to its assigned fixed length. 
    //         if (user_id.length !== constants.user.ID_FIXED_LENGTH) {
    //             return reject(CustomError.IDNotFixedLength(
    //                 {resourceName: 'user', fixed_length: constants.user.ID_FIXED_LENGTH}
    //             ));
    //         }

    //         this.userDAO.deleteEntity(user_id)
    //         .then(deletedUser => {
    //             deletedUser.can_edit = (deletedUser.can_edit === 1) ? true : false;
    //             return resolve(deletedUser);
    //         })
    //         .catch(reject);
    //     });
    // }
}

module.exports = UserDeleteController