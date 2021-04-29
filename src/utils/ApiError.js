const i18next = require('i18next');
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {

    // removing " " from error messages if there is any
    message = String(message).replace("\"", "")
    message = String(message).replace("\"", "")
    message = String(message).replace("\"", "")
    message = String(message).replace("\"", "")

    super(i18next.t(message));
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
