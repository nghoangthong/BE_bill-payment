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
     * @returns Json
     */
    serviceCategories = (req, res, next) => {
        try {
            Logger.debug('ServicesController::serviceCategories -- Get list of services.');
            let resData = this.#readBillServices();
            // response
            return res.json(
                ResponseBuilder.init().withData(resData.service_categories).build()
            );
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
     * @returns Json
     */
    services = (req, res, next) => {
        try {
            let serviceId = req.params.service_id;
            serviceId = serviceId.toUpperCase();

            Logger.debug('ServicesController::services -- Get list of services.');

            let resData = this.#readBillServices();
            let serviceItems = resData.services[serviceId];

            return res.json(
                ResponseBuilder.init()
                    .withData(serviceItems ? serviceItems : {})
                    .build()
            );
        } catch (error) {
            Logger.error(error);
            next(error);
        }
    };

    /**
     * Read masterdata
     *
     * @returns Json
     */
    #readBillServices() {
        try {
            let fileContent = fs.readFileSync(__ROOT + APP_SETTINGS.SERVICES_MASTER_DATA_FILE_PATH, 'utf8');
            let jsonData = JSON.parse(fileContent);

            return jsonData;
        } catch (error) {
            logger.error('Error while reading masterdata file:', error);
            throw error;
        }
    }
}

module.exports = new ServicesController();
