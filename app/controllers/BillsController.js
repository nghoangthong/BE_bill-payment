const BillCheckModel = require("../models/BillCheck");
const axios = require("axios");
const {v4: uuidv4} = require('uuid');
const JWTGenerator = require('../libraries/AppotaPay/JWTGenerator');
const SignatureGenerator = require('../libraries/AppotaPay/SignatureGenerator');
const ResponseBuilder = require("../libraries/Common/Builders/ResponseBuilder");
const {validateRequestSchema} = require("../middlewares/Common/ValidateRequest");
const {
    validateBillsCheckSchema,
    validateHeaderSchema
} = require('../libraries/AppotaPay/ValidationSchemas/BillsRequestSchema');

class BillsController {
    /**
     *
     * @returns {BillsController}
     */
    constructor() {
        return this;
    }

    /**
     * Check if the bill is valid to pay
     *
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    check = async (req, res, next) => {
        let partnerRefId = uuidv4();

        try {
            /**
             * Step 1: validate headers and request body
             */
            validateRequestSchema('headers', validateHeaderSchema);
            validateRequestSchema('body', validateBillsCheckSchema);

            /**
             * Step 2: lookup Bill Code on DB
             */
            Logger.debug(`BillsController::check -- Lookup Bill by Bill Code ${req.billCode}\n`);
            // 1. Lấy billCode từ request của Client App & check nếu Bill Code có dưới DB & vẫn còn thời gian chưa expired trong X phút kể từ thời điểm hiện tại.
            let bill = await BillCheckModel.getBillByBillCodeAsync(req.billCode);
            Logger.debug('BillsController::check -- Result: ', bill, "\n");

            if (bill) {
                // Bill has been checked last moment then response
                // 2. Nếu billCode có giá trị, trả về cho Client App.
                return res.json(
                    ResponseBuilder.init()
                        .withData(bill.response)
                        .build()
                );
            } else {//3. Nếu billCode không có giá trị thì gọi lên AppotaPay để check Bill, sau đó lưu lại thông tin đã check xuống DB  và trả về response cho Client App.
                // prepare jwt token
                let jwtToken = (new JWTGenerator()).generate();

                // prepare payload
                let reqPayload = {
                    // the bill number that user inputs
                    billCode: req.billCode,
                    // the unique id for reference
                    partnerRefId: partnerRefId,
                    // TODO: define a master data to provide the service codes to mobile app
                    // TODO: Mobile app needs to pass the service code that depends on the service user selected to pay the bill
                    serviceCode: req.serviceCode
                };

                // assign signature into payload
                reqPayload.signature = (new SignatureGenerator()).generate(reqPayload);

                Logger.debug('BillsController::check -- Procedure a bill check with payload ', reqPayload, "\n");

                // send POST request to AppotaPay
                let resData = await axios.post(
                    APP_SETTINGS.PARTNERS.APPOTAPAY.ENDPOINTS.BILL_CHECK.ENDPOINT,
                    reqPayload,
                    {
                        headers: {
                            'X-APPOTAPAY-AUTH': `${APP_SETTINGS.PARTNERS.APPOTAPAY.HEADERS.AUTH_HEADER_SCHEME} ${jwtToken}`,
                            'Content-Type': APP_SETTINGS.PARTNERS.APPOTAPAY.HEADERS.AUTH_HEADER_CONTENT_TYPE
                        }
                    }
                );

                Logger.debug('BillsController::check -- Response: ', resData, "\n");

                // persist data into table
                let record = await BillCheckModel.saveRecordAsync({
                    bill_code: reqPayload.billCode,
                    partner_ref_id: reqPayload.partnerRefId,
                    service_code: reqPayload.serviceCode,
                    response: resData
                });

                // response
                return res.json(
                    ResponseBuilder.init()
                        .withData(record)
                        .build()
                );
            }
        } catch (error) {
            Logger.error(`\n\n===BillsController::check -- Error while checking the bill ${req.billCode} and partnerRefId ${partnerRefId} \n`);
            Logger.error(error);
            next(error);
        }
    };

    /**
     * Make a request to pay the bill
     *
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    payment = async (req, res) => {
        try {
            // response
            return res.json(
                ResponseBuilder.init()
                    .withData({})
                    .build()
            );
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Query the status of a specific transaction
     *
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    transactions = async (req, res) => {
        try {
            // response
            return res.json(
                ResponseBuilder.init()
                    .withData({})
                    .build()
            );
        } catch (error) {
            console.error(error);
        }
    };
}

module.exports = new BillsController();
