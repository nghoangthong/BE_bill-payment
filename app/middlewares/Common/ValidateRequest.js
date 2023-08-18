const RequestValidationError = require("../../libraries/Exception/RequestValidationError");

/**
 * To validate request data
 *
 * @param {string} dataPath 'body' | 'query' | 'params' | 'headers'
 * @param {import('joi').ObjectSchema} schema
 * @description Validate request: body | query | params | headers
 */
function validateRequestSchema(dataPath, schema) {
    /**
     * Validate request body
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    return function (req, res, next) {
        const {error, value} = schema.validate(req[dataPath]);
        if (error) {
            // throws error
            throw new RequestValidationError({code: 4001, message: error.details[0].message});
        }

        // Attach the validated data into the request and ensures the correction of data types
        req[dataPath] = value;
        next();
    };
}

module.exports = {
    validateRequestSchema,
};
