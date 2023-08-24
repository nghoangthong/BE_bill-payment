const ResponseBuilder = require('../libraries/Common/Builders/ResponseBuilder');
const fs = require('fs');

class ServicesController {
    /**
     *
     * @returns {ServicesController}
     */
    constructor() {
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
    serviceCategories = (req, res, next) => {
        try {
            Logger.debug(
                `\n\nServicesController::serviceCategories -- Get list of services.\n`
            );
            const resData = this.#readBillServices();

            // response
            return res.json(ResponseBuilder.init().withData(resData.service_categories).build());
        } catch (error) {
            Logger.error(error);
            next(error);
        }
    };

    /**
     * Get list of services in a specific category
     *
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    services = (req, res, next) => {
        try {
            // TODO: biến trong function phải khai báo let, không dùng const cho biến, chỉ nên dùng const cho require() - hằng số!!!
            const serviceId = req.params.service_id;

            //TODO: áp dụng Joi để kiểm tra service_id không được empty, null, required => tạo middleware function để validate như bên BillsRoute

            serviceId = serviceId.toUpperCase(); // Chuyển thành chữ hoa
            Logger.debug(
                `ServicesController::services -- Get list of services.\n`
            );

            // TODO: biến trong function phải khai báo let, không dùng const cho biến, chỉ nên dùng const cho require() - hằng số!!!
            const resData = this.#readBillServices();

            // TODO: biến trong function phải khai báo let, không dùng const cho biến, chỉ nên dùng const cho require() - hằng số!!!
            const serviceCategory = resData.services[serviceId];

            if (serviceCategory) {
                // TODO: áp dụng ResponseBuilder
                return res.json(serviceCategory);
            } else {
                Logger.error('Service not found');
                // TODO: áp dụng ResponseBuilder, trong ResponseBuilder có .withMessage(), .withCode(), .withData() thì phải áp dụng
                return res.status(CONSTANT.HTTP_STATUS_NOT_FOUND).json({
                    // TODO: không được để 1 chuỗi tường minh như thế này trong dấu ngoặc kép => dùng ngoặc đơn
                    message: "Service not found",
                    errorCode: CONSTANT.HTTP_STATUS_NOT_FOUND,
                });
            }
        } catch (error) {
            Logger.error(error);
            next(error);
        }
    };

    /**
     * Read masterdata
     *
     * @returns {any}
     */
    #readBillServices() {
        try {
            const fileContent = fs.readFileSync(__ROOT + APP_SETTINGS.SERVICES_MASTER_DATA_FILE_PATH, 'utf8');
            const jsonData = JSON.parse(fileContent);

            return jsonData;
        } catch (error) {
            logger.error('Error while reading masterdata file:', error);
            throw error;
        }
    }
}

module.exports = new ServicesController();
