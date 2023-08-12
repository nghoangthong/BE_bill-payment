const DB = require("../models/PayMent");
const axios = require("axios");
const createJWT = require("../libraries/Utils/CreateJWT");
const createSignature = require("../libraries/Utils/CreateSignature");
const URL_ENDPOINT =
  "https://gateway.dev.appotapay.com/api/v1/service/bill/transaction/{partnerRefId}";

class BillController {
  // send api 
  sendApi = async (method, endpoint, data) => {
    try {
      const jwtToken = createJWT;
      const config = {
        headers: {
          "Content-Type": `${CONSTANT.AUTH_HEADER_CONTENT_TYPE}`,
          "X-APPOTAPAY-AUTH": `${CONSTANT.AUTH_HEADER_SCHEME} ${jwtToken}`,
        },
      };
      let response;
      if (method === 'post') {
        response = await axios.post(
          endpoint,
          createSignature.bodyJson(data),
          config
        );
      } else if (method === 'get') {
        response = await axios.get(endpoint, config);
      }
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("API response error:", error.response.data);
        return error.response.data;
      } else {
        console.error("Error sending API request:", error);
        throw error;
      }
    }
  };
  
  check = async (req, res) => {
    try {
      const data_into_billcheck = await this.sendApi(
        'post',
        APP_SETTINGS.ENDPOINT_BILL_CHECK,
        createSignature.BillCheck
      );
      DB.insertDataIntoBillCheck(data_into_billcheck);
      res.send(data_into_billcheck);
    } catch (error) {
      console.error(error);
    }
  };

  pay = async (req, res) => {
    try {
      const data_into_billpay = await this.sendApi(
        'post',
        APP_SETTINGS.ENDPOINT_BILL_PAY,
        createSignature.BillPay
      );
      DB.insertDataIntoBillPay(data_into_billpay);
      res.send(data_into_billpay);
    } catch (error) {
      console.error(error);
    }
  };

  transaction = async (req, res) => {
    const data_into_transaction = await this.sendApi(
      'get',
      URL_ENDPOINT.replace("{partnerRefId}", createSignature.Transaction)
    );
    DB.insertDataIntoBillTransaction(data_into_transaction);
    res.send(data_into_transaction);
  };
}

module.exports = new BillController();
