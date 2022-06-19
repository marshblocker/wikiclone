const CustomError = require('../../error');
const constants = require('../../constants');

class UserReadController {
    constructor(userDAO) {
        this.userDAO = userDAO;
    }

    readUser(user_id) {
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

            // TODO: determine how strict variable will be initialized.
            const strict = false;
            this.userDAO.readEntity(user_id, strict)
            .then(user => {
                user.can_edit = (user.can_edit === 1) ? true : false;
                return resolve(user);
            })
            .catch(reject);
        });
    }

    readAllUsers(query) {
        return new Promise((resolve, reject) => {            
            const strict = false;

            this.userDAO.readAllEntities(strict)
            .then(allUsers => {
                allUsers.forEach(user => user.can_edit = (user.can_edit === 1) ? true : false);
                return resolve(allUsers);
            })
            .catch(reject);
        })
    }
}

module.exports = UserReadController;