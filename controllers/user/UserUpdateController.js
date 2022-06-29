const CustomError = require('../../error');
const constants = require('../../constants');

class UserUpdateController {
    constructor(userDAO) {
        this.userDAO = userDAO;
    }

    updateUser(req, res) {
        this._updateUser(req.params.user_id, req.body)
            .then(user => res.status(200).json(user))
            .catch(error => res.status(error.code).json(error.message));
    }

    _updateUser(user_id, updatedUserAttributes) {
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

            this.userDAO.readEntity(user_id, false)
            .then(currentUserAttributes => {
                currentUserAttributes.can_edit = (currentUserAttributes.can_edit === 1) ? true : false;

                const userIDIndex = constants.user.ATTRIBUTES.indexOf('user_id');
                const requiredAttributeNames = constants.user.ATTRIBUTES.slice();
    
                // Temporary checking if the 'user_id' attribute was removed in the
                // requiredAttributeNames properly.
                const removedAttribute = requiredAttributeNames.splice(userIDIndex, 1)[0]; 
                if (removedAttribute !== 'user_id') {
                    return reject(CustomError.UnhandledError(
                        `Removed ${removedAttribute} instead of the user_id.`
                    ));
                }
    
                // Reject the request if one of the required attributes is null, undefined, or empty string.
                for (let i = 0; i < requiredAttributeNames.length; i++) {
                    const attributeName = requiredAttributeNames[i];
                    const attributeValue = updatedUserAttributes[attributeName];
                    if (attributeValue === undefined) {
                        return reject(CustomError.AttributeNotDefined(attributeName));
                    }
    
                    if ([null, ''].includes(attributeValue)) {
                        return reject(CustomError.InvalidAttributeValue(attributeName));
                    }
                }
    
                // Reject the request if an unknown attribute name was included in the request body.
                const requestSpecifiedAttributeNames = Object.keys(updatedUserAttributes);
                for (let i = 0; i < requestSpecifiedAttributeNames.length; i++) {
                    const attributeName = requestSpecifiedAttributeNames[i];
                    if (!requiredAttributeNames.includes(attributeName)) {
                        return reject(CustomError.AttrDoesNotExist(attributeName));
                    }
                }
    
                // Reject the request if a required string-type attribute contains whitespace in
                // between its value, e.g. 'ca tch'.
                const noMiddleWhiteSpaceAttributeNames = ['username', 'password', 'email'];
                for (let i = 0; i < noMiddleWhiteSpaceAttributeNames.length; i++) {
                    const attributeName = noMiddleWhiteSpaceAttributeNames[i];
                    updatedUserAttributes[attributeName] = updatedUserAttributes[attributeName].trim();
                    if (updatedUserAttributes[attributeName].includes(' ')) {
                        return reject(CustomError.WhiteSpaceInBetween(attributeName));
                    }
                }
    
                // Reject the request if the length of the given 'username' attribute exceeds its max length.
                if (updatedUserAttributes.username.length > constants.user.USERNAME_MAX_LENGTH) {
                    return reject(CustomError.AttrExceedsMaxLength(
                        { attributeName: 'username', maxLength: constants.user.USERNAME_MAX_LENGTH }
                        ));
                }
                    
                // Reject the request if the length of the given 'password' attribute is not equal to its
                // supposed fixed length.
                if (updatedUserAttributes.password.length !== constants.user.PASSWORD_FIXED_LENGTH) {
                    return reject(CustomError.PasswordNotFixedLength());
                }
                    
                // Reject the request if the length of the given 'email' attribute exceeds its max length.
                if (updatedUserAttributes.email.length > constants.user.EMAIL_MAX_LENGTH) {
                    return reject(CustomError.AttrExceedsMaxLength(
                        { attributeName: 'email', maxLength: constants.user.EMAIL_MAX_LENGTH }
                    ));
                }
    
                // Reject the request if the given 'role' attribute is not one of the
                // three valid roles: 'user', 'admin', 'superadmin'.
                if (!constants.user.VALID_ROLES.includes(updatedUserAttributes.role)) {
                    return reject(CustomError.InvalidUserRoleValue());
                }
    
                // Reject the request if the given 'can_edit' attribute is not boolean type.
                if (typeof updatedUserAttributes.can_edit !== 'boolean') {
                    return reject(CustomError.InvalidAttributeType('can_edit'));
                }

                let sameAttributeValues = true;
                for (let i = 0; i < requiredAttributeNames.length; i++) {
                    let attributeName = requiredAttributeNames[i];
                    if (currentUserAttributes[attributeName] !== updatedUserAttributes[attributeName]) {
                        sameAttributeValues = false;
                        break;
                    }
                }
                
                // Reject the request if the user's new attributes are the same with its
                // old attributes.
                if (sameAttributeValues) {
                    return reject(CustomError.NewSameWithOld('user'));
                }

                this.userDAO.updateEntity(user_id, updatedUserAttributes)
                .then(updatedUser => {
                    updatedUser.can_edit = (updatedUser.can_edit === 1) ? true : false;
                    return resolve(updatedUser);
                })
                .catch(reject);    
            })
            .catch(error => {
                // We want the error to be ResourceDoesNotExist. But if it is not, we
                // check what the other possible error/s could be.
                if (error.message !== '404 Not Found: The given id does not correspond to an existing user in the database!') {
                    console.log(error);
                }

                return reject(error);
            });
        });
    }
}

module.exports = UserUpdateController;