const CONSTANT = require('../../../config/constant');
const AppError = require('./AppError');

module.exports = class RequestValidationError extends AppError {
    constructor(response, details) {
        super('Bad Request', CONSTANT.HTTP_STATUS_BAD_REQUEST, response, details);
    }
};
