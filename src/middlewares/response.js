/**
 * Generates a Bad Request exception response.
 */
const badRequestException = async (details = null, description = null) => {
    let error = {}
    error.statusCode = 400;
    error.message = 'Bad Request';
    error.code = 'SCHEMA_VALIDATION_FAILED';
    error.description = description || 'The request data failed schema validation';
    error.details = details || {};

    const response = await errResObj(error)
    return response;
}

/**
 * Generates a Not Found (404) error response.
 */
const badRequest404 = async (details = null, description = null) => {
    let error = {}
    error.statusCode = 404;
    error.message = 'Bad Request';
    error.code = 'NOT_FOUND';
    error.description = description || 'The request data failed schema validation';
    error.details = details || {};
    const response = await errResObj(error)
    return response;
}

/**
 * Generates an Unauthorized (401) error response.
 */
const unauthorizedRequest = async (details = null) => {
    let error = {}
    error.statusCode = 401;
    error.message = 'Authorization Request';
    error.code = 'UNAUTHORIZED_REQUEST';
    error.description = 'Failed to validate the request user';
    error.details = details || {};

    const response = await errResObj(error)
    return response;
}

/**
 * Generates an Internal Server Error (500) response.
 */
const uncaughtException = async (details = null) => {
    let error = {}
    error.statusCode = 500;
    error.message = 'Internal sever error';
    error.code = 'INTERNAL_SERVER';
    error.description = 'An unexpected error occurred on the server';
    error.details = details || {};

    const response = await errResObj(error)
    return response;
}

/**
 * Generates a Forbidden (403) error response.
 */
const forbiddenRequest = async (details = null, description = null) => {
    let error = {}
    error.statusCode = 403;
    error.message = 'Forbidden Request';
    error.code = 'FORBIDDEN_REQUEST';
    error.description = description || 'Access to this resource is forbidden for the request user';
    error.details = details || {};

    const response = await errResObj(error)
    return response;
}

/**
 * Formats the error response object.
 */
const errResObj = async (data) => {
    return {
        message: data.message,
        error: {
            code: data.code,
            description: data.description,
            details: data.details,
        },
    };
}

/**
 * Generates a success response object.
 */
const successResponse = async (data = {}, message = null) => {
    const stringToBool = JSON.parse(JSON.stringify(data), (key, value) => {
        if (value === "true") {
            return true;
        } else if (value === "false") {
            return false;
        }
        return value;
    });
    return {
        message: message || 'Success',
        data: stringToBool || {}
    }
}

module.exports = {
    badRequestException,
    badRequest404,
    unauthorizedRequest,
    forbiddenRequest,
    uncaughtException,
    successResponse
};
