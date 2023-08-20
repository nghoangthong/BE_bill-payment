/**
 * Handle common error
 *
 * @author Long Pham
 * @type {*|start}
 */

const statuses = require('statuses');
const CONSTANT = require('../../../config/constant');
const AppError = require('../../libraries/Exception/AppError');

/**
 *
 * @param {any} error
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 */
function errorHandler(error, request, response, next) {
    let status = CONSTANT.HTTP_STATUS_INTERNAL_SERVER_ERROR;
    const responseError = {
        code: CONSTANT.HTTP_STATUS_INTERNAL_SERVER_ERROR,
        message: statuses.message[CONSTANT.HTTP_STATUS_INTERNAL_SERVER_ERROR],
    };
    let outMessage;

    // getting general response information
    if (error instanceof AppError) {
        status = error.status;

        responseError.code = status;
        responseError.message = error.message;
        responseError.data = error.responseData;

        outMessage = error.errorDetail ?? JSON.stringify(error.errorDetail);
    }

    // handling specific case bases on its name
    // TODO: add error name when a new error class is created
    switch (error.name) {
        case 'RequestValidationError':
        case 'HttpNotAcceptableError':
        case 'HttpNotFoundError':
            break;

        case 'PayloadTooLargeError':
        case 'UnsupportedMediaTypeError':
        case 'BadRequestError': {
            status = error.status;
            responseError.code = status;
            responseError.message = error.message;

            outMessage = [error.name, JSON.stringify(error)].join(" - ");
            break;
        }

        case 'RsaAuthError': {
            status = CONSTANT.HTTP_STATUS_UNAUTHORIZED;
            responseError.code = status;
            responseError.message = statuses.message[status];
            responseError.data = error.message;

            outMessage = ['RsaAuthError', error.message].join(" - ");
            break;
        }

        case 'AxiosError': {
            status = error.response.status;
            responseError.code = status;
            responseError.message = statuses.message[status];
            responseError.data = error.response.data;

            outMessage = ['AxiosError', error.message].join(" - ");
            break;
        }

        default:
            outMessage = error;
            break;
    }

    // store log
    outMessage && Logger.error(outMessage);

    response.status(status).json(responseError);

    Logger.debug('|--------------------o0o--------------------|');
    Logger.debug('|               Request ended!              |');
    Logger.debug('|--------------------o0o--------------------|');
}

module.exports = {errorHandler};
