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

const BillCheck = {
  "partnerRefId": "AB123",
  "billCode": "BILL_SUCCESS",
  "serviceCode": "EVN",
};

const BillPay = {
  "amount": 10000,
  "billDetail": "[{\"billNumber\":\"rb6GTrQ0zn6zWrVB\",\"period\":\"08/2099\",\"amount\":10000,\"billCreated\":\"\",\"billExpiry\":\"\",\"billType\":\"\",\"billOtherInfo\":\"\",\"isPartialPaymentAllowed\":false,\"extraInfo\":\"\"}]",
  "partnerRefId": "AB123",
  "billCode": "BILL_SUCCESS",
  "serviceCode": "EVN",
};

const Transaction = "AB123";


function bodyJson(data) {
    const newData = {...data};
    newData["signature"] = createSignature(newData, APP_SETTINGS.SECRET_KEY);
    // console.log(JSON.stringify(newData));
    return newData;
}

module.exports = {
  bodyJson,BillCheck, BillPay, Transaction
};
