const sdk = require('alphacore-sdk');
const APP_SETTINGS = require('../../../config/config');
const AppError = require('../../libraries/Exception/AppError');

/**
 * @description This middleware verifies RSA information from client using Nodejs SDK
 */
function RSAAuthMiddleware(req, res, next) {
    const requestTime = req.header('x-request-time');
    const clientId = req.header('x-client-id');
    const authorization = req.header('x-authorization');
    const resourceUrl = req.header('resource-url');
    const httpMethod = req.header('http-method');

    if (!requestTime || !clientId || !authorization || !resourceUrl || !httpMethod) {
        next(new AppError(null, 401, 'Missing header information.'));
        return;
    }

    const payload = req.rawBody;
    const headers = {
        'x-request-time': requestTime,
        'x-client-id': clientId,
        'x-authorization': authorization,
        'resource-url': resourceUrl,
        'http-method': httpMethod,
    };

    try {
        const rsaAuthenticator = new sdk.RsaAuthenticator(headers);
        rsaAuthenticator.init();
        rsaAuthenticator.initRsaTool(APP_SETTINGS.RSA.PUBLIC_KEY, APP_SETTINGS.RSA.PRIVATE_KEY, payload);

        // this method always returns true, otherwise throw an error: RsaAuthError
        rsaAuthenticator.authenticate();

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = RSAAuthMiddleware;
