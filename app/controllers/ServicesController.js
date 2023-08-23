const ResponseBuilder = require("../libraries/Common/Builders/ResponseBuilder");
const fs = require("fs");
const path = require("path");
const FILE_PATH = "C:/Alphacore/Appota_new/bill-payment/masterdata";
const filePath = path.join(FILE_PATH, "bill-services.json");

class ServicesController {
  #billServices = null;

  /**
   *
   * @returns {ServicesController}
   */
  constructor() {
    this.#billServices = this.#readBillServices();
    return this;
  }

  /**
   * Get service categories
   *
   * @param req
   * @param res
   * @param next
   * @returns {*}
   */
  servicecategories = (req, res, next) => {
    try {
      Logger.debug(
        `\n\nServicesController::services -- Get list of services.\n`
      );
      const resData = this.#readBillServices();
      // response
      return res.json(resData.service_categories);
      // return res.json(ResponseBuilder.init().withData({}).build());
    } catch (error) {
      Logger.error(error);
      next(error);
    }
  };
  services = (req, res, next) => {
    try {
        const rawServiceId = req.params.service_id;
        const serviceId = rawServiceId.toUpperCase(); // Chuyển thành chữ hoa
        Logger.debug(
            `\n\nServicesController::services -- Get list of services.\n`
        );

        const resData = this.#readBillServices();
        const serviceCategory = resData.services[serviceId];

        if (serviceCategory) {
            return res.json(serviceCategory);
        } else {
            Logger.error('Service not found');
            return res.status(CONSTANT.HTTP_STATUS_NOT_FOUND).json({
                message: "Service not found",
                errorCode: CONSTANT.HTTP_STATUS_NOT_FOUND,
            });
        }
    } catch (error) {
        Logger.error(error);
        next(error);
    }
};

  #readBillServices() {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const jsonData = JSON.parse(fileContent);
      return jsonData;
    } catch (error) {
      logger.error("Lỗi khi đọc tệp JSON:", error);
      throw new Error("Không thể đọc hoặc giải mã tệp JSON: " + error.message);
    }
  }
}

module.exports = new ServicesController();
