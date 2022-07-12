// If this will be updated, do not forget to update the length values of the 
// char-based attributes in the SQL files as well.
let constants = {
    user: {
        ATTRIBUTES: ['user_id', 'username', 'password', 'email', 'role', 'can_edit'],
        ID_FIXED_LENGTH: 9,
        USERNAME_MAX_LENGTH: 20,
        PASSWORD_MAX_LENGTH: 127,
        PASSWORD_HASH_FIXED_LENGTH: 60,
        EMAIL_MAX_LENGTH: 320,
        VALID_ROLES: ['user', 'admin', 'superadmin']
    },
    page: {
        ATTRIBUTES: ['page_id', 'title', 'content', 'freeze_page'],
        ID_FIXED_LENGTH: 9,
        TITLE_MAX_LENGTH: 32,
    },
    jwt: {
        ACCESS_TOKEN_SECRET: '74fd1d26f11a5984d73b9e2200fa2f0d94de6a2d09f59a3fa2ac748a48701d5065472b3631ff39d5eca9b639f2fabd4c4971a8b621294eb1487d1d4094cef67b'
    },
    reddis: {
        // In seconds.
        CACHE_EXPIRATION_TIME: 180
    }
};

module.exports = constants;