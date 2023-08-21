const ResponseBuilder = require('../libraries/Common/Builders/ResponseBuilder');

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
    services = (req, res, next) => {
        try {
            Logger.debug(`\n\nServicesController::services -- Get list of services.\n`);

            // response
            return res.json(
                ResponseBuilder.init()
                    .withData({})
                    .build()
            );
        } catch (error) {
            next(error);
        }
    }

    #readBillServices() {
        return null;
    }
}

module.exports = new ServicesController();