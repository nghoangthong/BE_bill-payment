const jwt = require('jsonwebtoken');

class JWTGenerator {
    generate() {
        let currentTime = Math.floor(Date.now() / 1000);
        let expiryTime = currentTime + 30;
        let jwtToken = jwt.sign({
            iss: APP_SETTINGS.PARTNERS.APPOTAPAY.CONNECTION.PARTNER_CODE,
            jti: `${APP_SETTINGS.PARTNERS.APPOTAPAY.CONNECTION.API_KEY}-${currentTime}`,
            api_key: APP_SETTINGS.PARTNERS.APPOTAPAY.CONNECTION.API_KEY,
            exp: expiryTime //expiry time is 30 seconds from time of creation
        }, APP_SETTINGS.PARTNERS.APPOTAPAY.CONNECTION.SECRET_KEY, {
            typ: 'JWT',
            alg: 'HS256',
            cty: 'appotapay-api;v=1'
        });

        Logger.debug(`\n\n===JWTGenerator::generate - Generated JWT Header Token in expiry time ${expiryTime}: ${jwtToken}`);

        return jwtToken;
    }
}

module.exports = JWTGenerator;