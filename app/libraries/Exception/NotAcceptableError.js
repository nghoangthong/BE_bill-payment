module.exports = class NotAcceptableError extends require ('./AppError') {
  constructor (message, code) {
    // Providing default message and overriding status code.
    super (message || 'Not Acceptable', code);

    this.code = this.statusCode = code;
  }
};