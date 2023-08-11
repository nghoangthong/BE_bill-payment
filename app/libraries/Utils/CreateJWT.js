const jwt = require('jsonwebtoken');
const header = {
  typ: "JWT",
  alg: "HS256",
  cty: "appotapay-api;v=1"
};

const partnerCode = APP_SETTINGS.PARTNER_CODE;
const apiKey = APP_SETTINGS.API_KEY;
const currentTime = Math.floor(Date.now() / 1000);
const expirationTime = currentTime + (60 * 60); 

const payload = {
  iss: partnerCode,
  jti: `${apiKey}-${currentTime}`,
  api_key: apiKey,
  exp: expirationTime
};

const secretKey = APP_SETTINGS.SECRET_KEY;
const token = jwt.sign(payload, secretKey, { header });
// console.log('token', token);
module.exports = token;