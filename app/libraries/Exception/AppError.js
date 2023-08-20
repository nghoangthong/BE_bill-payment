const statuses = require('statuses');
const CONSTANT = require('../../../config/constant');

module.exports = class AppError extends Error {
  constructor(message, status, responseData, errorDetail) {
    // Calling parent constructor of base Error class.
    super(message, status);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;
    this.responseData = responseData;
    this.errorDetail = errorDetail;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    this.status = statuses.message[status] ? status : CONSTANT.HTTP_STATUS_INTERNAL_SERVER_ERROR;
    this.message = message ?? statuses.message[status];
  }

  toResponse() {
    return {
      code: this.status,
      message: this.message,
      data: this.responseData,
      metadata: {
        created: new Date().toISOString(),
      },
    };
  }

  toString() {
    const args = [this.name, this.message];

    if (this.errorDetail) {
      args.push(this.errorDetail);
    }
    return args.join(' - ');
  }
};
