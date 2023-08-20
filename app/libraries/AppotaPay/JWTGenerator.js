const jws = require('jws');

class JWTGenerator {
    /**
     * Generate Json web signature
     * @returns {*}
     */
    generate() {
        let currentTime = Math.floor(Date.now() / 1000);
        let expiryTime = currentTime + 30;
        let jwtToken = jws.sign({
            header: {
                typ: 'JWT',
                alg: 'HS256',
                cty: 'appotapay-api;v=1'
            },
            payload: {
                iss: APP_SETTINGS.PARTNERS.APPOTAPAY.CONNECTION.PARTNER_CODE,
                jti: `${APP_SETTINGS.PARTNERS.APPOTAPAY.CONNECTION.API_KEY}-${currentTime}`,
                api_key: APP_SETTINGS.PARTNERS.APPOTAPAY.CONNECTION.API_KEY,
                exp: expiryTime //expiry time is 30 seconds from time of creation
            },
            secret: APP_SETTINGS.PARTNERS.APPOTAPAY.CONNECTION.SECRET_KEY
        });

        Logger.debug(`===JWTGenerator::generate - Generated JWT Header Token in expiry time ${expiryTime}: ${jwtToken}\n`);

        return jwtToken;
    }
}

module.exports = JWTGenerator;