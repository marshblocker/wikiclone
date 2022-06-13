let users = require('./database/usersDatabase');
let pages = require('./database/pagesDatabase');

const USER_ID_LENGTH = 9;

let utils = {
    // Checks if all the required parameters for user-based actions are 
    // provided by the user and if they are all used properly.
    // patchReceiverID is only needed when HTTPMethod === 'PATCH'.
    validateUserRequiredParams: function(requiredParams, givenParams, HTTPMethod, patchReceiverID) {
        const usersIDs = Object.keys(users);

        if (['GET', 'DELETE'].includes(HTTPMethod) && Object.keys(givenParams).length !== 0) {
            const error = {
                code: 400,
                message: 'The request should not contain a request body.'
            };
            return { error };
        }

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

        let message = '';
        if (givenParams.user_id !== undefined) {
            if (givenParams.user_id.length !== USER_ID_LENGTH) {
                message = 'Invalid user_id parameter value.';
            }
        }
        else if (givenParams.page_id !== undefined) {
            if (pages[givenParams.page_id] === undefined) {
                message: 'The given page does not exist!'
            }
        }
        else if (givenParams.username !== undefined) {
            if (!givenParams.username) {
                message = 'Invalid username parameter value.';
            }
            if (!message) {
                givenParams.username = givenParams.username.trim();
                if (['POST', 'PATCH'].includes(HTTPMethod) && givenParams.username.includes(' ')) {
                    message = 'Username cannot contain whitespace in between.';
                }
                else if (HTTPMethod === 'PATCH' && users[patchReceiverID].username === givenParams.username) {
                    message = 'New username must not be the same with the old username.';
                }
                else if (HTTPMethod === 'POST' && alreadyUsed('username', givenParams.username, users, usersIDs)) {
                    message = 'Username already used by another account!';
                }
            }
        }
        else if (givenParams.password !== undefined) {
            if (!givenParams.password) {
                message = 'Invalid password parameter value.';
            }
            if (!message) {
                givenParams.password = givenParams.password.trim();
                if (['POST', 'PATCH'].includes(HTTPMethod) && givenParams.password.includes(' ')) {
                    message = 'Password cannot contain whitespace in between.';
                }
                else if (HTTPMethod === 'PATCH' && users[patchReceiverID].password === givenParams.password) {
                    message = 'New password must not be the same with the old password.';
                }
            }
        }
        else if (givenParams.email !== undefined) {
            if (!givenParams.email) {
                message = 'Invalid email parameter value.';
            }
            if (!message) {
                givenParams.email = givenParams.email.trim();
                if (['POST', 'PATCH'].includes(HTTPMethod) && givenParams.email.includes(' ')) {
                    message = 'Email cannot contain whitespace in between.';
                }
                else if (HTTPMethod === 'PATCH' && users[patchReceiverID].email === givenParams.email) {
                    message = 'New email must not be the same with the old email.';
                }
                else if (HTTPMethod === 'POST' && alreadyUsed('email', givenParams.email, users, usersIDs)) {
                    message = 'Email already used by another account!';
                }
            }
        }
        else if (givenParams.role !== undefined) {
            const validRoles = ['user', 'admin', 'superadmin'];
            if (!givenParams.role || !validRoles.includes(givenParams.role)) {
                message = 'Invalid role parameter value.';
            }
            else if (HTTPMethod === 'PATCH' && users[patchReceiverID].role === givenParams.role) {
                message = 'New role must not be the same with the old role.';
            }
        }
        else if (givenParams.contributed_pages !== undefined) {
            if (givenParams.contributed_pages.constructor !== Array) {
                message = 'Invalid contributed pages parameter.';
            }
        }
        else if (givenParams.page_action_requests !== undefined) {
            if (givenParams.page_action_requests.constructor !== Array) {
                message = 'Invalid page action requests parameter.';
            }
        }

        if (message) {
            return { error: { "code": 400, "message": message } };
        }
    
        return true;
    },

    validatePageRequiredParams: function(requiredParams, givenParams, HTTPMethod, patchReceiverID) {
        const pagesIDs = Object.keys(pages);

        if (['GET', 'DELETE'].includes(HTTPMethod) && Object.keys(givenParams).length !== 0) {
            const error = {
                code: 400,
                message: 'The request should not contain a request body.'
            };
            return { error };
        }

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

        let message = '';
        if (givenParams.title !== undefined) {
            if (!givenParams.title) {
                message = 'Invalid title parameter value.';
            }
            if (!message) {
                givenParams.title = givenParams.title.trim();
                if (HTTPMethod === 'PATCH' && pages[patchReceiverID].title === givenParams.title) {
                    message = 'New title must not be the same with the old title.';
                }
                else if (HTTPMethod === 'POST' && alreadyUsed('title', givenParams.title, pages, pagesIDs)) {
                    message = 'Title already used by another page!';
                }
            }
        }
        else if (givenParams.content !== undefined) {
            if (!givenParams.content) {
                message = 'Invalid content parameter value.';
            }
        }
        else if (givenParams.version !== undefined) {
            if (!givenParams.version) {
                message = 'Invalid version parameter value.';
            }
            if (!message) {
                givenParams.version = +givenParams.version;
                if (isNaN(givenParams.version)) {
                    message = 'Invalid version parameter value.';
                }
            }
        }
        else if (givenParams.contributors !== undefined) {
            if (givenParams.contributors.constructor !== Array) {
                message = 'Invalid contributors parameter value.';
            }
        }
        else if (givenParams.creator_id !== undefined) {
            if (!givenParams.creator_id) {
                message = 'Invalid creator parameter value.';
            }
            if (!message) {
                if (users[creator_id] === undefined) {
                    message = 'The provided page creator does not exist!';
                }
            }
        }

        if (message) {
            return { error: { "code": 400, "message": message } };
        }
    
        return true;
    }
}

function alreadyUsed(attributeName, value, dataBase, IDs) {
    for (let i = 0; i < IDs.length; i++) {
        if (dataBase[IDs[i]][attributeName] === value) {
            return true;
        }
    }
    return false;
}

module.exports = utils;