const CONSTANT = require('../../../config/constant');
const AppError = require('./AppError');

module.exports = class HttpNotAcceptableError extends AppError {
    constructor(message, response) {
        super(message, CONSTANT.HTTP_STATUS_NOT_ACCEPTABLE, response);
    }
};
