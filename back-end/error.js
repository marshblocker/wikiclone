const constants = require("./constants");

class ReturnedError {
    constructor(code, message, customCode) {
        this.code = code;
        this.message = message;
        this.customCode = customCode
    }
}

class SpecificReturnedError extends ReturnedError {
    constructor(code, message, specific, customCode) {
        super(code, message, customCode);
        this.attributeName = specific;
    }
}

class CustomError {
    // Code 400: Client made a mistake in its request form.
    InvalidAttributeValue = (attributeName) => new SpecificReturnedError(400, `400 Bad Request: Invalid ${attributeName} parameter value.`, null, 1001);
    InvalidAttributeType = (attributeName) => new SpecificReturnedError(400, `400 Bad Request: Invalid ${attributeName} parameter type.`, null, 1002);
    InvalidQueryParameterName = (queryName) => new SpecificReturnedError(400, `400 Bad Request: Invalid query parameter name: ${queryName}.`, null, 1003);
    InvalidQueryParameterValue = (givenValue) => new SpecificReturnedError(400, `400 Bad Request: Invalid query parameter value: ${givenValue}.`, null, 1004);
    InvalidRoleFilter = (givenRole) => new SpecificReturnedError(400, `400 Bad Request: Invalid role filter value ('role=${givenRole}'). Allowed values: 'user', 'admin', 'superadmin'.`, null, 1005);
    InvalidCanEditFilter = (givenCanEdit) => new SpecificReturnedError(400, `400 Bad Request: Invalid can_edit filter value ('can_edit=${givenCanEdit}'). Allowed values: true, false.`, null, 1006);
    InvalidStrictQueryParameter = (givenStrict) => new SpecificReturnedError(400, `400 Bad Request: Invalid strict query parameter value ('strict=${givenStrict}'). Allowed values: true, false.`, null, 1007);
    InvalidFreezePageFilter = (givenFreezePage) => new SpecificReturnedError(400, `400 Bad Request: Invalid freeze_page filter value ('freeze_page=${givenFreezePage}'). Allowed values: true, false.`, null, 1008);
    InvalidSortBy = (givenSortBy) => new SpecificReturnedError(400, `400 Bad Request: Invalid sort_by value ('sort_by=${givenSortBy}'). Do not forget to prepend plus ('+') or minus ('-') sign before the attribute to be sorted to indicate the sorting order (e.g. 'sort_by=+user_id' means sort the users by their user_id in ascending order). Allowed attributes to sort the entries by: 'user_id', 'username', 'email', 'role', 'can_edit' (for user resource), and 'page_id', 'title', 'freeze_page' (for page resource).`, null, 1009);
    InvalidPaging = () => new ReturnedError(400, `400 Bad Request: Invalid page or page_entries query parameters values. Make sure they are positive (non-zero) integer numbers.`, 1010);
    InvalidUserRoleValue = () => new ReturnedError(400, "400 Bad Request: Invalid role parameter value. Allowed values: 'user', 'admin', 'superadmin'.", 1011);
    InvalidChangeUserRoleValue = () => new ReturnedError(400, "400 Bad Request: Invalid role parameter value. Allowed values: 'user', 'admin'.", 1012);
    MissingPagingParameter = () => new ReturnedError(400, '400 Bad Request: Both page and page_entries parameter must be specified to perform paging.', 1013);
    MissingRequiredURLParamAttr = (attributeName) => new SpecificReturnedError(400, `400 Bad Request: Missing required URL parameter attribute: ${attributeName}.`, null, 1014);
    MissingRequiredURLQueryAttr = (attributeName) => new SpecificReturnedError(400, `400 Bad Request: Missing required URL query attribute: ${attributeName}.`, null, 1015);
    TooManyParameters = () => new ReturnedError(400, '400 Bad Request: Too many parameters provided.', 1016);
    TooFewParameters = () => new ReturnedError(400, '400 Bad Request: Too few parameters provided.', 1017);
    AttributeNotDefined = (attributeName) => new SpecificReturnedError(400, `400 Bad Request: ${attributeName} attribute was not defined in the request body.`, null, 1018);
    AttrDoesNotExist = (attributeName) => new SpecificReturnedError(400, `400 Bad Request: ${attributeName} is not an existing attribute name of the resource.`, null, 1019);
    AttrExceedsMaxLength = (attributeSpecifics) => new SpecificReturnedError(400, `400 Bad Request: The given ${attributeSpecifics.attributeName} exceeds its max length (${attributeSpecifics.maxLength}).`, null, 1020);
    ReachedPageLimit = () => new ReturnedError(400, `400 Bad Request: Reached page limit.`, 1021);
    WhiteSpaceInBetween = (attributeName) => new SpecificReturnedError(400, `400 Bad Request: ${attributeName} cannot contain whitespace in between its string value.`, null, 1022);
    NoAttrSpecified = () => new ReturnedError(400, '400 Bad Request: No attribute specified.', 1023);
    PasswordHashNotFixedLength = () => new ReturnedError(400, `400 Bad Request: The length of the given password hash is not equal to ${constants.user.PASSWORD_HASH_FIXED_LENGTH}.`, 1024);
    IDNotFixedLength = (attributeSpecifics) => new SpecificReturnedError(400, `400 Bad Request: The length of the provided ${attributeSpecifics.resourceName} id is not equal to ${attributeSpecifics.fixed_length}.`, null, 1025);
    DuplicateQueryParameter = (givenQueryParameter) => new SpecificReturnedError(400, `400 Bad Request: The ${givenQueryParameter} query parameter was already used.`, null, 1026);
    WrongPassword = () => new ReturnedError(400, '400 Bad Request: Wrong password.', 1027);
    NoJWTPassed = () => new ReturnedError(400, '400 Bad Request: No JSON Web Token passed.', 1028);
    UserDoesNotExist = () => new ReturnedError(400, '400 Bad Request: The given user credentials does not match an existing user in the database.', 1029);

    // Code 403: Client has no access to the requested resource or action to a resource.
    ForbidCreatePage = () => new ReturnedError(403, '403 Forbidden: The user is not allowed to create a new page.', 2001);
    ForbidDeletePage = () => new ReturnedError(403, '403 Forbidden: The user is not allowed to delete a page.', 2002);
    ForbidFreezePage = () => new ReturnedError(403, '403 Forbidden: Only an admin or a superadmin can freeze a page.', 2003);
    ForbidEditPage = () => new ReturnedError(403, '403 Forbidden: The user is not allowed to edit a page.', 2004);
    ChangeUserRoleRestriction = () => new ReturnedError(403, '403 Forbidden: Only a superadmin can change the role of another user.', 2005);
    SuperAdminChangeUserRoleRestriction = () => new ReturnedError(403, '403 Forbidden: A superadmin cannot change the role of another superadmin.', 2006);

    // Code 404: Requested resource does not exist in the database.
    ResourceDoesNotExist = (resourceName) => new ReturnedError(404, `404 Not Found: The given id does not correspond to an existing ${resourceName} in the database!`, 3001);

    // Code 405: The action to a specific resource is not allowed by the server.
    CannotDeletePage = () => new ReturnedError(405, '405 Method Not Allowed: The page is restricted from being deleted.', 4001);
    CannotEditPage = () => new ReturnedError(405, '405 Method Not Allowed: The page is restricted from being edited.', 4002);

    // Code 409: Client request conflicts with the current state of the server.
    NewSameWithOld = (resourceName) => new SpecificReturnedError(409, `409 Conflict: The update request did not change any attributes of the ${resourceName}.`, null, 5001);
    ValueAlreadyUsed = (attributeName) => new SpecificReturnedError(409, `409 Conflict: ${attributeName} already used by another account.`, null, 5002);
    UnknownUserID = () => new ReturnedError(409, '409 Conflict: Specified user_id does not belong to any existing user.', 5003);
    DuplicateAttributeValue = (attributeName) => new SpecificReturnedError(409, `409 Conflict: The provided value for the ${attributeName} attribute has already been used by another user.`, null, 5004);

    // Code 500: Server-caused error.
    UnhandledError = (errorMessage) => new ReturnedError(500, `500 Internal Server Error: This error was not yet caught by the server. Error Message: ${errorMessage}`, 5005);
}

module.exports = new CustomError;