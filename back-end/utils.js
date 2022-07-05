const constants = require('./constants');
const CustomError = require('./error');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const utils = {
    checkPageContent(content) {
        if (!content) {
            throw CustomError.InvalidAttributeValue('content');
        }
        if (!content.title || typeof content.title !== 'string') {
            throw CustomError.InvalidAttributeValue('content.title');
        }      
        if (typeof content.image_url !== 'string') {
            throw CustomError.InvalidAttributeValue('content.image_url');
        }
        if (!content.lead) {
            throw CustomError.InvalidAttributeValue('content.lead');
        }
        if (!content.body) {
            throw CustomError.InvalidAttributeValue('content.body');
        }
    },
    
    checkUserInfo(info, attributeNames) {
        if (!info) {
            throw CustomError.InvalidAttributeValue('info');
        }

        const infoKeys = Object.keys(info);
        for (let i = 0; i < infoKeys.length; i++) {
            this.checkWhiteSpace(info[infoKeys[i]], infoKeys[i]);
        }

        if (attributeNames.includes('username')) {
            this.checkUserName(info['username']);
        }
        if (attributeNames.includes('password')) {
            this.checkUserName(info['password']);
        }
        if (attributeNames.includes('email')) {
            this.checkEmail(info['email']);
        }
    },

    async hashPassword(password) {
        const hash = await (async () => {
            return await bcrypt.hash(password, 10);
        })();

        if (hash.length != constants.user.PASSWORD_HASH_FIXED_LENGTH) {
            throw CustomError.PasswordHashNotFixedLength();
        }

        return hash;
    },

    checkWhiteSpace(attribute, attributeName) {
        attribute = attribute.trim();
        if (attribute.includes(' ')) {
            throw CustomError.WhiteSpaceInBetween(attributeName);
        }
    },

    checkUserName(userName) {
        if (userName.length > constants.user.USERNAME_MAX_LENGTH) {
            throw CustomError.AttrExceedsMaxLength({
                attributeName: 'username',
                maxLength: constants.user.USERNAME_MAX_LENGTH
            });
        }
    },

    checkEmail(email) {
        if (email.length > constants.user.EMAIL_MAX_LENGTH) {
            throw CustomError.AttrExceedsMaxLength({
                attributeName: 'email',
                maxLength: constants.user.EMAIL_MAX_LENGTH
            });
        }
    },

    checkPassword(password) {
        if (password.length > constants.user.PASSWORD_MAX_LENGTH) {
            throw CustomError.AttrExceedsMaxLength({
                attributeName: 'password',
                maxLength: constants.user.PASSWORD_MAX_LENGTH
            });
        }
    },

    checkRole(role) {
        if (!['user, admin, superadmin'].includes(role)) {
            throw CustomError.InvalidUserRoleValue();
        }
    },

    checkCanEdit(canEdit) {
        if (![true, false].includes(canEdit)) {
            throw CustomError.InvalidAttributeValue('can_edit');
        }
    },

    parseToken(req, res, next) {
        console.log('Hi');
        if (req.get('Authorization') == null) {
            req.parsedToken = null;
            next();
        }
        const token = req.get('Authorization').split('=')[1];
        if (!token) {
            return res.status(400).json({ message: 'No token found.' });
        }
        const parsedToken = jwt.verify(token, constants.jwt.ACCESS_TOKEN_SECRET);
        req.parsedToken = parsedToken;
        next();
    }
}

module.exports = utils;