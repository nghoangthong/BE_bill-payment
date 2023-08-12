const DB = require("../models/PayMent");
const axios = require("axios");
const createJWT = require("../libraries/Utils/CreateJWT");
const createSignature = require("../libraries/Utils/CreateSignature");

// TODO: move into config.js
const URL_ENDPOINT = 'https://gateway.dev.appotapay.com/api/v1/service/bill/transaction/{partnerRefId}';

class BillsController {
    // send api
    sendApi = async (method, endpoint, data) => {
        try {
            const config = {
                headers: {
                    'Content-Type': `${CONSTANT.AUTH_HEADER_CONTENT_TYPE}`,
                    'X-APPOTAPAY-AUTH': `${CONSTANT.AUTH_HEADER_SCHEME} ${createJWT}`,
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
                console.error('API response error:', error.response.data);
                return error.response.data;
            } else {
                console.error('Error sending API request:', error);
                throw error;
            }
        }
    };

    /**
     * Check if the bill valid to pay
     *
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    check = async (req, res) => {
        try {
            DB.createBillCheck(); // TODO: not to create schema directly in code

            let resData = await this.sendApi(
                'post',
                APP_SETTINGS.ENDPOINT_BILL_CHECK,
                createSignature.bill_check
            );

            // persist data into table
            await DB.insertDataIntoBillCheck(resData);
            res.send(resData);
        } catch (error) {
            console.error(error);
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
            DB.createBillPay(); // TODO: not to create schema directly in code

            const resData = await this.sendApi(
                'post',
                APP_SETTINGS.ENDPOINT_BILL_PAY,
                createSignature.bill_pay
            );

            await DB.insertDataIntoBillPay(resData);
            res.send(resData);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Check the transaction querying from AppotaPay
     *
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    transactions = async (req, res) => {
        DB.createTransaction(); // TODO: not to create schema directly in code

        const resData = await this.sendApi(
            'get',
            URL_ENDPOINT.replace('{partnerRefId}', createSignature.transactionId)
        );

        await DB.insertDataIntoBillTransaction(resData);
        res.send(resData);
    };
}

module.exports = new BillsController();
