module.exports = class DbConnectionError extends require ('./AppError') {
  constructor (message, code) {
    // Providing default message and overriding status code.
    super (message || 'Database connection error', code);

    this.code = this.statusCode = code;
  }
};