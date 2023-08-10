const crypto = require("crypto");

function createSignature(data, secretKey) {
  // sort
  const sortedKeys = Object.keys(data).sort();

  // Create a string containing sorted parameters
  const sortedString = sortedKeys.map((key) => `${key}=${data[key]}`).join("&");
  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(sortedString);
  const signature = hmac.digest("hex");

  return signature;
}

const bill_check = {
  "partnerRefId": "AB1234",
  "billCode": "BILL_SUCCESS",
  "serviceCode": "EVN",
};

const bill_pay = {
  "amount": 10000,
  "billDetail": "[{\"billNumber\":\"9uiDyYoVtxzCvtmF\",\"period\":\"08/2099\",\"amount\":10000,\"billCreated\":\"\",\"billExpiry\":\"\",\"billType\":\"\",\"billOtherInfo\":\"\",\"isPartialPaymentAllowed\":false,\"extraInfo\":\"\"}]",
  "partnerRefId": "AB123",
  "billCode": "BILL_SUCCESS",
  "serviceCode": "EVN",
};


function bodyJson(data){
  data["signature"] = createSignature(data, APP_SETTINGS.SECRET_KEY);
  return data
};
module.exports = {
  bodyJson,bill_check, bill_pay
};
