const crypto = require('crypto');

class SignatureGenerator {
    generate (params) {
        // sort
        let sortedParams = Object.keys(params).sort();

        // Create a string containing sorted parameters
        let sortedString = sortedParams.map((key) => `${key}=${params[key]}`).join('&');
        let hmacKey = crypto.createHmac('sha256', APP_SETTINGS.PARTNERS.APPOTAPAY.CONNECTION.SECRET_KEY);
        let signature = hmacKey.update(sortedString).digest('hex');

        Logger.debug(`\n\n===SignatureGenerator::generate - Generated signature based on parameters `, params, `: ${signature}\n`);

        return signature;
    }
}

module.exports = SignatureGenerator;