'use strict';

var http = require('http');

var ServerError = function(status, reason, message, systemError) {
    this.status = status;
    this.reason = reason;
    this.message = message;
    this.systemError = systemError;
    this.errors = [];

    //Allows multiple errors to be added into the response, if necessary
    this.error = function(reason, message) {
        this.errors.push({
            reason: reason,
            message: message
        });

        return this;
    };

    this.toJSON = function() {
        var response = {
            error: {
                code: this.status,
                message: http.STATUS_CODES[this.status],
                errors: this.errors
            }
        };

        return response;
    };

    if (this.reason && this.message) {
        this.error(this.reason, this.message);
    }

    return this;
};

ServerError.LOCATION_TYPES = {
    BODY: "entity-body",
    PATH: "path",
    PARAMETER: "parameter"
};

//TODO : Arrange this by service
//Supported Error reasons
ServerError.REASONS = {
    INTERNAL_SERVER_ERROR: "internal_server_error",
    NOT_FOUND: "not_found",
    EMAIL_EXISTS: "email_exists",
    FAILED_TO_CREATE_POSY: "failed_to_create_posy",
    FAILED_TO_RETRIEVE_POSY: "failed_to_retrieve_posy",
    FAILED_TO_RETRIEVE_USER: "failed_to_retrieve_user",
    FAILED_TO_RETRIEVE_USERS: "failed_to_retrieve_users",
    FAILED_TO_RETRIEVE_POCKET: "failed_to_retrieve_pocket",
    FAILED_TO_RETRIEVE_POSIES_FROM_POCKET: "failed_to_retrieve_posies_from_pocket",
    FAILED_TO_RETRIEVE_POCKETS: "failed_to_retrieve_pockets",
    FAILED_TO_RETRIEVE_POSIES: "failed_to_retrieve_posies",
    USER_NOT_FOUND: "user_not_found",
    USERS_NOT_FOUND: "user_not_founds",
    POSY_NOT_FOUND: "posy_not_found",
    POSIES_NOT_FOUND: "posies_not_found",
    POCKET_NOT_FOUND: "pocket_not_found",
    POCKETS_NOT_FOUND: "pocket_not_founds",
    CANNOT_UPDATE_PUBLISHED_POSY: "cannot_update_published_posy",
    FAILED_TO_UPDATE_USER_EMAIL: "failed_to_update_user_email",
    FAILED_TO_UPDATE_USER: "failed_to_update_user",
    FAILED_TO_UPDATE_POSY: "failed_to_update_posy",
    FAILED_TO_UPDATE_POCKET: "failed_to_update_pocket",
    CANNOT_DELETE_PUBLISHED_POSY: "cannot_delete_published_posy",
    CANNOT_DELETE_PUBLISHED_POCKET: "cannot_delete_published_pocket",
    CANNOT_UPDATE_PUBLISHED_POCKET: "cannot_update_published_pocket",
    CANNOT_MODIFY_PUBLISHED_POCKET: "cannot_modify_published_pocket",
    FAILED_TO_DELETE_USER: "failed_to_delete_user",
    FAILED_TO_DELETE_POSY: "failed_to_delete_posy",
    FAILED_TO_DELETE_POCKET: "failed_to_delete_pocket",
    FAILED_TO_CREATE_POCKET: "failed_to_create_pocket",
    FAILED_TO_INSERT_POSY_INTO_POCKET: "failed_to_insert_posy_into_pocket",
    FAILED_TO_DELETE_POSY_IN_POCKET: "failed_to_delete_posy_in_pocket",
    MISSING_REQUIRED_PROPERTY: "missing_required_property",
    UNSUPPORTED_PROPERTIES: "unsupported_properties",
    INVALID_PROPERTIES: "invalid_properties",
    FAILED_TO_CREATE_USER: "failed_to_create_user",
    FAILED_TO_GENERATE_USER: "failed_to_generate_user", //This is when the password fails to hash
    USER_NOT_AUTHORIZED: "user_not_authorized",
    ERROR_CREATING_USER_TOKEN: "error_creating_user_token",
    FAILED_TO_SEND_LOGIN_REQUEST_EMAIL: "failed_to_send_login_request_email",
    INVALID_CREDENTIALS: "invalid_credentials",
    FAILED_TO_VALIDATE_USER: "failed_to_validate_user",
    UNAUTHORIZED_ACCESS: "unauthorized_access"
};

exports.ServerError = ServerError;