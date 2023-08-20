const CONSTANT = require('../../../config/constant');
const AppError = require('./AppError');

module.exports = class HttpNotFoundError extends AppError {
    constructor(message, response) {
        super(message, CONSTANT.HTTP_STATUS_NOT_FOUND, response);
    }
};
