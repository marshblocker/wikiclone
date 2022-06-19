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
    InvalidFilter = (attributeName) => new SpecificReturnedError(400, `400 Bad Request: Invalid query filter ('attr=${attributeName}') value. Allowed values: 'role', 'can_edit'.`);
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