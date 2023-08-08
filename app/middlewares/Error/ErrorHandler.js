/**
 * Handle common error
 *
 * @author Long Pham
 * @type {*|start}
 */

const statuses = require ('statuses');

const production = process.env.APPLICATION_ENVIRONMENT === 'production';

// handle common api errors
// TODO: We should define error in more details
const ErrorHandler = function () {
  return function errorHandler (err, req, res, next) {
    Logger.debug ('|--------------------o0o--------------------|');
    Logger.debug ('|               Request ended!              |');
    Logger.debug ('|--------------------o0o--------------------|');

    let status = err.status || err.statusCode || CONSTANT.HTTP_STATUS_INTERNAL_SERVER_ERROR;
    res.statusCode = status;

    let body = {
      code: err.code || status,
      name: err.name || 'Error'
      //, type: err.type || null
    };

    // show the stacktrace when not in production
    if (!production) {
      body.stack = err.stack;
    }

    // client errors
    body.errorDetails = err.message;

    res.json ({message: statuses[status], code: status, data: body});
  }
};
module.exports = ErrorHandler;
