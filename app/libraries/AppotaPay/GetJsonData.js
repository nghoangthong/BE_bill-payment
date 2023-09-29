const { json } = require("body-parser");
const fs = require("fs");
const CONSTANT = require('../../../config/constant')

class GetJsonData {
  /**
   * get bill status
   *
   * @param string errorCode
   * @returns string
   */
  getBillStatus(errorCode) {
    try {
      const rawData = fs.readFileSync(APP_SETTINGS.ERROR_FILE_PATH);
      const jsonData = JSON.parse(rawData);
      if (jsonData.Error && jsonData.Error[errorCode]) {
        return CONSTANT.BILL_DETAIL.BILL_STATUS.ERROR;
      }

      if (jsonData.Success && jsonData.Success[errorCode]) {
        return CONSTANT.BILL_DETAIL.BILL_STATUS.SUCCESS;
      }
      if (jsonData.Retry && jsonData.Retry[errorCode]) {
        return CONSTANT.BILL_DETAIL.BILL_STATUS.RETRY;
      }
      if (jsonData.Pending && jsonData.Pending[errorCode]) {
        return CONSTANT.BILL_DETAIL.BILL_STATUS.PENDING;
      }

      return CONSTANT.BILL_DETAIL.UNKNOWN;
    } catch (error) {
      Logger.error("function getBillStatus | error:", error);
      return false;
    }
  }

  /**
   * get service code
   *
   * @param string serviceCode
   * @returns string
   */
  getServiceCode(serviceCode) {
    try {
      const rawData = fs.readFileSync(
        APP_SETTINGS.SERVICES_MASTER_DATA_FILE_PATH
      );
      const jsonData = JSON.parse(rawData);
      const serviceGroups = [
        CONSTANT.BILL_DETAIL.SERVICE_CODE.BILL_ELECTRIC,
        CONSTANT.BILL_DETAIL.SERVICE_CODE.BILL_WATER,
        CONSTANT.BILL_DETAIL.SERVICE_CODE.BILL_TELEVISION,
        CONSTANT.BILL_DETAIL.SERVICE_CODE.BILL_INTERNET,
        CONSTANT.BILL_DETAIL.SERVICE_CODE.BILL_TELEPHONE,
      ];

      for (const group of serviceGroups) {
        if (jsonData.services[group] && jsonData.services[group][serviceCode]) {
          return CONSTANT.BILL_DETAIL.TYPE_SERVICE.ONE;
        }
      }

      if (
        jsonData.services[CONSTANT.BILL_DETAIL.SERVICE_CODE.BILL_FINANCE] &&
        jsonData.services[CONSTANT.BILL_DETAIL.SERVICE_CODE.BILL_FINANCE][serviceCode]
      ) {
        return CONSTANT.BILL_DETAIL.TYPE_SERVICE.MANY;
      }

      return CONSTANT.BILL_DETAIL.UNKNOWN;
    } catch (error) {
      Logger.error("function getServiceCode | error:", error);
      return false
    }
  }
}

module.exports = GetJsonData;
