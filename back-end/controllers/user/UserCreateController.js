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

    // createUser(req, res) {
    //     this._createUser(req.body)
    //         .then(user => res.status(201).json(user))
    //         .catch(error => res.status(error.code).json(error.message));
    // }

    // _createUser(newUserAttributes) {
    //     return new Promise((resolve, reject) => {
    //         const userIDIndex = constants.user.ATTRIBUTES.indexOf('user_id');
    //         const requiredAttributeNames = constants.user.ATTRIBUTES.slice();

    //         // Temporary checking if the 'user_id' attribute was removed in the
    //         // requiredAttributeNames properly.
    //         const removedAttribute = requiredAttributeNames.splice(userIDIndex, 1)[0]; 
    //         if (removedAttribute !== 'user_id') {
    //             return reject(CustomError.UnhandledError(
    //                 `Removed ${removedAttribute} instead of the user_id.`
    //             ));
    //         }

    //         // Reject the request if one of the required attributes is null, undefined, or empty string.
    //         for (let i = 0; i < requiredAttributeNames.length; i++) {
    //             const attributeName = requiredAttributeNames[i];
    //             const attributeValue = newUserAttributes[attributeName];
    //             if (attributeValue === undefined) {
    //                 return reject(CustomError.AttributeNotDefined(attributeName));
    //             }

    //             if ([null, ''].includes(attributeValue)) {
    //                 return reject(CustomError.InvalidAttributeValue(attributeName));
    //             }
    //         }

    //         // Reject the request if an unknown attribute name was included in the request body.
    //         const requestSpecifiedAttributeNames = Object.keys(newUserAttributes);
    //         for (let i = 0; i < requestSpecifiedAttributeNames.length; i++) {
    //             const attributeName = requestSpecifiedAttributeNames[i];
    //             if (!requiredAttributeNames.includes(attributeName)) {
    //                 return reject(CustomError.AttrDoesNotExist(attributeName));
    //             }
    //         }

    //         // Reject the request if a required string-type attribute contains whitespace in
    //         // between its value, e.g. 'ca tch'.
    //         const noMiddleWhiteSpaceAttributeNames = ['username', 'password', 'email'];
    //         for (let i = 0; i < noMiddleWhiteSpaceAttributeNames.length; i++) {
    //             const attributeName = noMiddleWhiteSpaceAttributeNames[i];
    //             newUserAttributes[attributeName] = newUserAttributes[attributeName].trim();
    //             if (newUserAttributes[attributeName].includes(' ')) {
    //                 return reject(CustomError.WhiteSpaceInBetween(attributeName));
    //             }
    //         }

    //         // Reject the request if the length of the given 'username' attribute exceeds its max length.
    //         if (newUserAttributes.username.length > constants.user.USERNAME_MAX_LENGTH) {
    //             return reject(CustomError.AttrExceedsMaxLength(
    //                 { attributeName: 'username', maxLength: constants.user.USERNAME_MAX_LENGTH }
    //                 ));
    //         }
                
    //         // Reject the request if the length of the given 'password' attribute is not equal to its
    //         // supposed fixed length.
    //         if (newUserAttributes.password.length !== constants.user.PASSWORD_FIXED_LENGTH) {
    //             return reject(CustomError.PasswordNotFixedLength());
    //         }
                
    //         // Reject the request if the length of the given 'email' attribute exceeds its max length.
    //         if (newUserAttributes.email.length > constants.user.EMAIL_MAX_LENGTH) {
    //             return reject(CustomError.AttrExceedsMaxLength(
    //                 { attributeName: 'email', maxLength: constants.user.EMAIL_MAX_LENGTH }
    //             ));
    //         }

    //         // Reject the request if the given 'role' attribute is not one of the
    //         // three valid roles: 'user', 'admin', 'superadmin'.
    //         if (!constants.user.VALID_ROLES.includes(newUserAttributes.role)) {
    //             return reject(CustomError.InvalidUserRoleValue());
    //         }

    //         // Reject the request if the given 'can_edit' attribute is not boolean type.
    //         if (typeof newUserAttributes.can_edit !== 'boolean') {
    //             return reject(CustomError.InvalidAttributeType('can_edit'));
    //         }

    //         this.userDAO.createEntity(newUserAttributes)
    //         .then(newUser => {
    //             newUser.can_edit = (newUser.can_edit === 1) ? true : false;
    //             return resolve(newUser);
    //         })
    //         .catch(reject);
    //     });
    // }
}

module.exports = UserCreateController;