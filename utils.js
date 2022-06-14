let users = require('./database/usersDatabase');
let pages = require('./database/pagesDatabase');

const USER_ID_LENGTH = 9;

let utils = {
    // Checks if all the required parameters for user-based actions are 
    // provided by the user and if they are all used properly.
    // patchReceiverID is only needed when HTTPMethod === 'PATCH'.
    validateUserRequiredParams: function(requiredParams, givenParams, HTTPMethod, patchReceiverID) {
        let validateRes = generalValidationStep(requiredParams, givenParams);
        if (validateRes !== 'valid') return validateRes;
        console.log(1)

        const usersIDs = Object.keys(users);

        const validationFunctions = [
            validateUserID, validatePageID, validateUsername,
            validatePassword, validateEmail, validateRole,
            validateCanEdit
        ];

        const parameters = [
            'user_id', 'page_id', 'username', 'password', 'email', 'role', 'can_edit'
        ];

        for (let i = 0; i < validationFunctions.length;  i++) {
            if (givenParams[parameters[i]] !== undefined) {
                validateRes = validationFunctions[i]();
                if (validateRes !== 'valid') return validateRes;
            }
            console.log(i);
        }

        return 'valid';

        function validateUserID() {
            if (givenParams.user_id.length !== USER_ID_LENGTH) {
                const error = {
                    code: 400,
                    message: 'Invalid user_id parameter value.' 
                };
                return { error };
            }
            return 'valid';
        }
        function validatePageID() {
            if (pages[givenParams.page_id] === undefined) {
                const error = {
                    code: 404,
                    message: 'The given page does not exist!'
                };
                return { error };
            }
            return 'valid';
        }
        function validateUsername() {
            let code;
            let message = '';
            if (!givenParams.username) {
                code = 400;
                message = 'Invalid username parameter value.';
            }
            if (!message) {
                givenParams.username = givenParams.username.trim();
                if (['POST', 'PATCH'].includes(HTTPMethod) && givenParams.username.includes(' ')) {
                    code = 400;
                    message = 'Username cannot contain whitespace in between.';
                }
                else if (HTTPMethod === 'PATCH' && users[patchReceiverID].username === givenParams.username) {
                    code = 409;
                    message = 'New username must not be the same with the old username.';
                }
                else if (HTTPMethod === 'POST' && alreadyUsed('username', givenParams.username, users, usersIDs)) {
                    code = 409;
                    message = 'Username already used by another account!';
                }
            }
            if (message) {
                const error = { "code": code, "message": message };
                return { error };
            }
            return 'valid';
        }
        function validatePassword() {
            let code;
            let message = '';
            if (!givenParams.password) {
                code = 400;
                message = 'Invalid password parameter value.';
            }
            if (!message) {
                givenParams.password = givenParams.password.trim();
                if (['POST', 'PATCH'].includes(HTTPMethod) && givenParams.password.includes(' ')) {
                    code = 400;
                    message = 'Password cannot contain whitespace in between.';
                }
                else if (HTTPMethod === 'PATCH' && users[patchReceiverID].password === givenParams.password) {
                    code = 409;
                    message = 'New password must not be the same with the old password.';
                }
            }
            if (message) {
                const error = { "code": code, "message": message };
                return { error };
            }
            return 'valid';
        }
        function validateEmail() {
            let code;
            let message = '';
            if (!givenParams.email) {
                code = 400;
                message = 'Invalid email parameter value.';
            }
            if (!message) {
                givenParams.email = givenParams.email.trim();
                if (['POST', 'PATCH'].includes(HTTPMethod) && givenParams.email.includes(' ')) {
                    code = 400;
                    message = 'Email cannot contain whitespace in between.';
                }
                else if (HTTPMethod === 'PATCH' && users[patchReceiverID].email === givenParams.email) {
                    code = 409;
                    message = 'New email must not be the same with the old email.';
                }
                else if (HTTPMethod === 'POST' && alreadyUsed('email', givenParams.email, users, usersIDs)) {
                    code = 409;
                    message = 'Email already used by another account!';
                }
            }
            if (message) {
                const error = { "code": code, "message": message };
                return { error };
            }
            return 'valid';
        }
        function validateRole() {
            let code;
            let message = ''
            const validRoles = ['user', 'admin', 'superadmin'];
            if (!givenParams.role || !validRoles.includes(givenParams.role)) {
                code = 400;
                message = 'Invalid role parameter value.';
            }
            else if (HTTPMethod === 'PATCH' && users[patchReceiverID].role === givenParams.role) {
                code = 409;
                message = 'New role must not be the same with the old role.';
            }
            if (message) {
                const error = { "code": code, "message": message };
                return { error };
            }
            return 'valid';
        }
        function validateCanEdit() {
            let code;
            let message = '';
            if (![true, false].includes(givenParams.can_edit)) {
                code = 400;
                message = 'Invalid can_edit parameter value.';
            }
            if (message) {
                const error = { "code": code, "message": message };
                return { error };
            }

            return 'valid';
        }    
    },

    validatePageRequiredParams: function(requiredParams, givenParams, HTTPMethod, patchReceiverID) {
        let validateRes = generalValidationStep(requiredParams, givenParams);
        if (validateRes !== 'valid') {
            return validateRes;
        }

        const pagesIDs = Object.keys(pages); 
        const validationFunctions = [
            validateTitle, validateContent, validateFreezePage,
        ];
        const parameters = [
            'title', 'content', 'freeze_page'
        ];

        for (let i = 0; i < validationFunctions.length; i++) {
            if (givenParams[parameters[i]] !== undefined) {
                validateRes = validationFunctions[i]();
                if (validateRes !== 'valid') return validateRes;
            }
        }

        return 'valid';

        function validateTitle() {
            let code;
            let message = ''
            if (!givenParams.title) {
                code = 400;
                message = 'Invalid title parameter value.';
            }
            if (!message) {
                givenParams.title = givenParams.title.trim();
                if (HTTPMethod === 'PATCH' && pages[patchReceiverID].title === givenParams.title) {
                    code = 409;
                    message = 'New title must not be the same with the old title.';
                }
                else if (HTTPMethod === 'POST' && alreadyUsed('title', givenParams.title, pages, pagesIDs)) {
                    code = 409;
                    message = 'Title already used by another page!';
                }
            }
            if (message) {
                const error = { "code": code, "message": message };
                return { error };
            }
            return 'valid';
        }
        function validateContent() {
            let code;
            let message = ''
            if (!givenParams.content) {
                code = 400;
                message = 'Invalid content parameter value.';
            }
            if (message) {
                const error = { "code": code, "message": message };
                return { error };
            }
            return 'valid';
        }
        function validateFreezePage() {
            let code;
            let message = '';
            if (![true, false].includes(givenParams.freeze_page)) {
                code = 400;
                message = 'Invalid freeze_page parameter value.';
            }
            if (message) {
                const error = { "code": code, "message": message };
                return { error };
            }
            return 'valid';            
        }
    },

    validateSenderUserID(req, users) {
        let code;
        let message = '';
        if (req.body.user_id === undefined) {
            code = 400;
            message = 'user_id not specified as a query parameter.';
        }

        else if (!Object.keys(users).some(user_id => user_id === req.body.user_id)) {
            code = 409;
            message = 'Specified user_id does not belong to any existing user.';
        }

        if (message) {
            const error = { "code": code, "message": message };
            return { error };
        }
        return 'valid';
    }
}

function generalValidationStep(requiredParams, givenParams) {
    if (Object.keys(givenParams).length > requiredParams.length) {
        const error = {
            code: 400,
            message: 'Too many parameters provided.'
        };
        return { error };
    } else if (Object.keys(givenParams).length < requiredParams.length) {
        const error = {
            code: 400,
            message: 'Too few parameters provided.'
        };
        return { error };
    }

    for (let i = 0; i < requiredParams.length; i++) {
        if (givenParams[requiredParams[i]] === undefined) {
            const error = {
                code: 400,
                message: `Missing required parameter: ${requiredParams[i]}.`
            }
            return { error };
        }
    }

    return 'valid';
}

function alreadyUsed(attributeName, value, dataBase, IDs) {
    console.log(dataBase);
    console.log(value);
    console.log(IDs);
    for (let i = 0; i < IDs.length; i++) {
        if (dataBase[IDs[i]][attributeName] === value) {
            return true;
        }
    }
    return false;
}

module.exports = utils;