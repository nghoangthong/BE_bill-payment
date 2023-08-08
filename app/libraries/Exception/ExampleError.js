module.exports = class ClientError extends require ('./AppError') {
  constructor (message, code) {
    // Providing default message and overriding status code.
    super (message || 'Invalid client', code);

    this.code = this.statusCode = this.status = code;
  }
};