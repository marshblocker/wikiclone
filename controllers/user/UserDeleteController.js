const CustomError = require('../../error');
const constants = require('../../constants');

class UserDeleteController {
    constructor(userDAO) {
        this.userDAO = userDAO;
    }

    deleteUser(user_id) {
        return new Promise((resolve, reject) => {
            // Reject the request if user_id is undefined, null, or empty string.
            if ([undefined, '', null].includes(user_id)) {
                return reject(CustomError.MissingRequiredURLParamAttr('user_id'));
            }

            // Reject the request if the length of user_id is not equal to its assigned fixed length. 
            if (user_id.length !== constants.user.ID_FIXED_LENGTH) {
                return reject(CustomError.IDNotFixedLength(
                    {resourceName: 'user', fixed_length: constants.user.ID_FIXED_LENGTH}
                ));
            }

            this.userDAO.deleteEntity(user_id)
            .then(deletedUser => {
                deletedUser.can_edit = (deletedUser.can_edit === 1) ? true : false;
                return resolve(deletedUser);
            })
            .catch(reject);
        });
    }
}

module.exports = UserDeleteController