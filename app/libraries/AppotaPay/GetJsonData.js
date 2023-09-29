const fs = require("fs");
const APP_SETTINGS = require("../../../config/config");

class GetJsonData {
  /**
   * get bill status
   *
   * @param errorCode
   * @returns string
   */
  getBillStatus(errorCode) {
    try {
      const rawData = fs.readFileSync(APP_SETTINGS.ERROR_FILE_PATH);
      const jsonData = JSON.parse(rawData);
      if (jsonData.Error && jsonData.Error[errorCode]) {
        return APP_SETTINGS.BILL_DETAIL.BILL_STATUS.ERROR;
      }

      if (jsonData.Success && jsonData.Success[errorCode]) {
        return APP_SETTINGS.BILL_DETAIL.BILL_STATUS.SUCCESS;
      }
      if (jsonData.Retry && jsonData.Retry[errorCode]) {
        return APP_SETTINGS.BILL_DETAIL.BILL_STATUS.RETRY;
      }
      if (jsonData.Pending && jsonData.Pending[errorCode]) {
        return APP_SETTINGS.BILL_DETAIL.BILL_STATUS.PENDING;
      }

      return APP_SETTINGS.BILL_DETAIL.UNKNOWN;
    } catch (error) {
      Logger.error("function getBillStatus | error:", error);
      return false;
    }
  }

  /**
   * get service code
   *
   * @param serviceCode
   * @returns string
   */
  getServiceCode(serviceCode) {
    try {
      const rawData = fs.readFileSync(
        APP_SETTINGS.SERVICES_MASTER_DATA_FILE_PATH
      );
      const jsonData = JSON.parse(rawData);
      const serviceGroups = [
        APP_SETTINGS.BILL_DETAIL.SERVICE_CODE.BILL_ELECTRIC,
        APP_SETTINGS.BILL_DETAIL.SERVICE_CODE.BILL_WATER,
        APP_SETTINGS.BILL_DETAIL.SERVICE_CODE.BILL_TELEVISION,
        APP_SETTINGS.BILL_DETAIL.SERVICE_CODE.BILL_INTERNET,
        APP_SETTINGS.BILL_DETAIL.SERVICE_CODE.BILL_TELEPHONE,
      ];

      for (const group of serviceGroups) {
        if (jsonData.services[group] && jsonData.services[group][serviceCode]) {
          return APP_SETTINGS.BILL_DETAIL.TYPE_SERVICE.ONE;
        }
      }

      if (
        jsonData.services[APP_SETTINGS.BILL_DETAIL.SERVICE_CODE.BILL_FINANCE] &&
        jsonData.services[APP_SETTINGS.BILL_DETAIL.SERVICE_CODE.BILL_FINANCE][serviceCode]
      ) {
        return APP_SETTINGS.BILL_DETAIL.TYPE_SERVICE.MANY;
      }

      return APP_SETTINGS.BILL_DETAIL.UNKNOWN;
    } catch (error) {
      Logger.error("function getServiceCode | error:", error);
      return false
    }
  }
}

module.exports = GetJsonData;
