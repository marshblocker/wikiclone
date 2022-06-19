const constants = require("./constants");

class ReturnedError {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}

class SpecificReturnedError extends ReturnedError {
    constructor(code, message, specific) {
        super(code, message);
        this.attributeName = specific;
    }
}

class CustomError {
    // Code 400: Client made a mistake in its request form.
    InvalidAttributeValue = (attributeName) => new SpecificReturnedError(400, `400 Bad Request: Invalid ${attributeName} parameter value.`);
    InvalidAttributeType = (attributeName) => new SpecificReturnedError(400, `400 Bad Request: Invalid ${attributeName} parameter type.`);
    InvalidQueryParameterName = (queryName) => new SpecificReturnedError(400, `400 Bad Request: Invalid query parameter name: ${queryName}.`);
    InvalidRoleFilter = (givenRole) => new SpecificReturnedError(400, `400 Bad Request: Invalid role filter value ('role=${givenRole}'). Allowed values: 'user', 'admin', 'superadmin'.`);
    InvalidCanEditFilter = (givenCanEdit) => new SpecificReturnedError(400, `400 Bad Request: Invalid can_edit filter value ('can_edit=${givenCanEdit}'). Allowed values: true, false.`);
    InvalidStrictQueryParameter = (givenStrict) => new SpecificReturnedError(400, `400 Bad Request: Invalid strict query parameter value ('strict=${givenStrict}'). Allowed values: true, false.`);
    InvalidFreezePageFilter = (givenFreezePage) => new SpecificReturnedError(400, `400 Bad Request: Invalid freeze_page filter value ('freeze_page=${givenFreezePage}'). Allowed values: true, false.`);
    InvalidSortBy = (givenSortBy) => new SpecificReturnedError(400, `400 Bad Request: Invalid sort_by value ('sort_by=${givenSortBy}'). Do not forget to prepend plus ('+') or minus ('-') sign before the attribute to be sorted to indicate the sorting order (e.g. 'sort_by=+user_id' means sort the users by their user_id in ascending order). Allowed attributes to sort the entries by: 'user_id', 'username', 'email', 'role', 'can_edit' (for user resource), and 'page_id', 'title', 'freeze_page' (for page resource).`);
    InvalidPaging = () => new ReturnedError(400, `400 Bad Request: Invalid page or page_entries query parameters values. Make sure they are positive (non-zero) integer numbers.`);
    MissingPagingParameter = () => new ReturnedError(400, '400 Bad Request: Both page and page_entries parameter must be specified to perform paging.');
    ReachedPageLimit = () => new ReturnedError(400, `400 Bad Request: Reached page limit.`);
    AttributeNotDefined = (attributeName) => new SpecificReturnedError(400, `400 Bad Request: ${attributeName} attribute was not defined.`);
    InvalidUserRoleValue = () => new ReturnedError(400, "400 Bad Request: Invalid role parameter value. Allowed values: 'user', 'admin', 'superadmin'.");
    InvalidChangeUserRoleValue = () => new ReturnedError(400, "400 Bad Request: Invalid role parameter value. Allowed values: 'user', 'admin'.");
    WhiteSpaceInBetween = (attributeName) => new SpecificReturnedError(400, `400 Bad Request: ${attributeName} cannot contain whitespace in between its string value.`);
    TooManyParameters = () => new ReturnedError(400, '400 Bad Request: Too many parameters provided.');
    TooFewParameters = () => new ReturnedError(400, '400 Bad Request: Too few parameters provided.');
    MissingRequiredURLParamAttr = (attributeName) => new SpecificReturnedError(400, `400 Bad Request: Missing required URL parameter attribute: ${attributeName}.`);
    MissingRequiredURLQueryAttr = (attributeName) => new SpecificReturnedError(400, `400 Bad Request: Missing required URL query attribute: ${attributeName}.`);
    NoAttrSpecified = () => new ReturnedError(400, '400 Bad Request: No attribute specified.');
    AttrDoesNotExist = (attributeName) => new SpecificReturnedError(400, `400 Bad Request: ${attributeName} is not an existing attribute name of the resource.`);
    AttrExceedsMaxLength = (attributeSpecifics) => new SpecificReturnedError(400, `400 Bad Request: The given ${attributeSpecifics.attributeName} exceeds its max length (${attributeSpecifics.maxLength}).`);
    PasswordNotFixedLength = () => new ReturnedError(400, `400 Bad Request: The length of the given password is not equal to ${constants.user.PASSWORD_FIXED_LENGTH}.`);
    IDNotFixedLength = (attributeSpecifics) => new SpecificReturnedError(400, `400 Bad Request: The length of the provided ${attributeSpecifics.resourceName} id is not equal to ${attributeSpecifics.fixed_length}.`);

    // Code 403: Client has no access to the requested resource or action to a resource.
    ForbidCreatePage = () => new ReturnedError(403, '403 Forbidden: The user is not allowed to create a new page.');
    ForbidDeletePage = () => new ReturnedError(403, '403 Forbidden: The user is not allowed to delete a page.');
    ForbidFreezePage = () => new ReturnedError(403, '403 Forbidden: Only an admin or a superadmin can freeze a page.');
    ForbidEditPage = () => new ReturnedError(403, '403 Forbidden: The user is not allowed to edit a page.');
    ChangeUserRoleRestriction = () => new ReturnedError(403, '403 Forbidden: Only a superadmin can change the role of another user.');
    SuperAdminChangeUserRoleRestriction = () => new ReturnedError(403, '403 Forbidden: A superadmin cannot change the role of another superadmin.');

    // Code 404: Requested resource does not exist in the database.
    ResourceDoesNotExist = (resourceName) => new ReturnedError(404, `404 Not Found: The given id does not correspond to an existing ${resourceName} in the database!`);

    // Code 405: The action to a specific resource is not allowed by the server.
    CannotDeletePage = () => new ReturnedError(405, '405 Method Not Allowed: The page is restricted from being deleted.');
    CannotEditPage = () => new ReturnedError(405, '405 Method Not Allowed: The page is restricted from being edited.');

    // Code 409: Client request conflicts with the current state of the server.
    NewSameWithOld = (resourceName) => new SpecificReturnedError(409, `409 Conflict: The update request did not change any attributes of the ${resourceName}.`);
    ValueAlreadyUsed = (attributeName) => new SpecificReturnedError(409, `409 Conflict: ${attributeName} already used by another account.`);
    UnknownUserID = () => new ReturnedError(409, '409 Conflict: Specified user_id does not belong to any existing user.');
    DuplicateAttributeValue = (attributeName) => new SpecificReturnedError(409, `409 Conflict: The provided value for the ${attributeName} attribute has already been used by another user.`);

    // Code 500: Server-caused error.
    UnhandledError = (errorMessage) => new ReturnedError(500, `500 Internal Server Error: This error was not yet caught by the server. Error Message: ${errorMessage}`);
}

module.exports = new CustomError;