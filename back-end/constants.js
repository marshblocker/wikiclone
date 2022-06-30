// If this will be updated, do not forget to update the length values of the 
// char-based attributes in the SQL files as well.
let constants = {
    user: {
        ATTRIBUTES: ['user_id', 'username', 'password', 'email', 'role', 'can_edit'],
        ID_FIXED_LENGTH: 9,
        USERNAME_MAX_LENGTH: 20,
        PASSWORD_FIXED_LENGTH: 40,
        EMAIL_MAX_LENGTH: 320,
        VALID_ROLES: ['user', 'admin', 'superadmin']
    },
    page: {
        ATTRIBUTES: ['page_id', 'title', 'content', 'freeze_page'],
        ID_FIXED_LENGTH: 9,
        TITLE_MAX_LENGTH: 32,
    }
};

module.exports = constants;