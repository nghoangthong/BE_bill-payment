const statuses = require("statuses");
const CONSTANT = require("../../../../config/constant");

/**
 * @description create a builder that construct the general data response structure based on API standard
 */
module.exports = class ResponseBuilder {
	_code;
	_message;
	_data;

	constructor() {
		this._code = CONSTANT.HTTP_STATUS_OK;
		this._message = statuses.message[this._code] ?? 'OK';
		this._data = undefined;
	}

	static init() {
		return new ResponseBuilder();
	}

	withMessage(msg) {
		this._message = msg && msg.trim() ? msg : statuses.message[this._code];
		return this;
	}

	withCode(code) {
		this._code = !code || !statuses(code) ? CONSTANT.HTTP_STATUS_OK : code;
		this._message = statuses.message[this._code] ?? 'OK';
		return this;
	}

	withData(data) {
		this._data = data;
		return this;
	}

	/**
     * @example
     *  {
            "code": "200",
            "message": "OK",
            "data": "any",
            "metadata": {
                "created": "2023-01-12T06:46:16.575Z"
            }
        }
     */
	build() {
		return {
			code: this._code,
			message: this._message,
			data: this._data,
			metadata: {
				created: new Date().toISOString(),
			},
		};
	}
};
