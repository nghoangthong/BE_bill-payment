const CONSTANT = require('../../../config/constant');
const AppError = require('./AppError');

module.exports = class DbConnectionError extends AppError {
  constructor(message, response) {
    super(message, CONSTANT.HTTP_STATUS_INTERNAL_SERVER_ERROR, response);
  }
};