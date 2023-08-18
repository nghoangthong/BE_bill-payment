const CONSTANT = require("../../../../config/constant");
const AppError = require("../../Exception/AppError");

/**
 * @description create a builder that construct the general error structure based on AppError
 */
module.exports = class ErrorBuilder {
	_message;
	_responseData;
	_errors;

	constructor() {
		this._status = CONSTANT.HTTP_STATUS_INTERNAL_SERVER_ERROR;
	}

	static init() {
		return new ErrorBuilder();
	}

	withStatus(status) {
		this._status = status;
		return this;
	}

	withMessage(message) {
		this._message = message;
		return this;
	}

	withResponseData(resData) {
		this._responseData = resData;
		return this;
	}

	withErrors(errors) {
		this._errors = errors;
		return this;
	}

	build() {
		return new AppError(this._message, this._status, this._responseData, this._errors);
	}
};
