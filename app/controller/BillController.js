const APP_SETTINGS = require("../../config/config");
const SendApi = require("../libraries/Utils/Bill");
const Data = require("../libraries/Utils/CreateSignature");
const DB = require('../models/PayMent')

class BillController {
  async check(req, res) {
    try {
      DB.createBillCheck();
      const data_into_billcheck = await SendApi.sendApiPost(
        APP_SETTINGS.ENDPOINT_BILL_CHECK,
        Data.bill_check
      );
      DB.insertDataIntoBillCheck(data_into_billcheck)
    } catch (error) {
      console.error(error);
    }
  }

  async bill(req, res) {}
}

module.exports = new BillController;
