const BillCheckModel = require('../models/BillCheck');
const BillPaymentModel = require('../models/PayMent');
const TransactionModel = require('../models/Transactions');
const PaymentHistories = require('../models/PaymentHistories');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const JWTGenerator = require('../libraries/AppotaPay/JWTGenerator');
const SignatureGenerator = require('../libraries/AppotaPay/SignatureGenerator');
const ResponseBuilder = require('../libraries/Common/Builders/ResponseBuilder');
const RequestValidationError = require('../libraries/Exception/RequestValidationError');
const GetJsonData = require('../libraries/AppotaPay/GetJsonData');
const APP_SETTINGS = require('../../config/config');

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
   * @param next
   * @returns {Promise<void>}
   */
  check = async (req, res, next) => {
    let billCode = req.body.billcode;
    let serviceCode = req.body.service_code;
    let partnerRefId = uuidv4();

    try {
      // TODO: define a master data to provide the service codes to mobile app
      // TODO: Mobile app needs to pass the service code that depends on the value that user selected to pay the bill

      /**
       * Step 2: lookup Bill Code on DB
       */
      Logger.debug(
        `\n\nBillsController::check -- Lookup Bill by Bill Code ${billCode}\n`
      );
      // 1. Lấy billCode từ request của Client App & check nếu Bill Code có dưới DB & vẫn còn thời gian chưa expired trong X phút kể từ thời điểm hiện tại.
      let bill = await BillCheckModel.getBillByBillCodeAsync(billCode);
      Logger.debug('BillsController::check -- Result: ', bill);

      if (bill) {
        // Bill has been checked last moment then response to client app
        // 2. Nếu billCode có giá trị, trả về cho Client App.
        return res.json(ResponseBuilder.init().withData(bill).build());
      } else {
        //3. Nếu billCode không có giá trị thì gọi lên AppotaPay để check Bill, sau đó lưu lại thông tin đã check xuống DB  và trả về response cho Client App.
        Logger.debug(
          `BillsController::check -- Bill does not exist, checking with AppotaPay...\n`
        );

        let record = await this.#checkAvailableBill({
          // the bill number that user inputs
          billCode: billCode,
          // the unique id for reference
          partnerRefId: partnerRefId,
          // service code
          serviceCode: serviceCode,
        });

        // response
        return res.json(ResponseBuilder.init().withData(record).build());
      }
    } catch (error) {
      Logger.error(
        `===BillsController::check -- Error while checking the bill:${billCode} and partnerRefId:${partnerRefId} and serviceCode:${serviceCode} \n`
      );
      Logger.error(error);

      await BillCheckModel.saveRecordAsync({
        billCode: billCode ? billCode : '',
        partner_ref_id: partnerRefId ? partnerRefId : '',
        service_code: serviceCode ? serviceCode : '',
        response:
          Object.prototype.toString.call(error.response.data) ===
            '[object Object]'
            ? error.response.data
            : {
              message: error.response.data,
              errorCode: error.response.status,
            },
      });

      next(error);
    }
  };

  /**
   * Private function: to check available bill for the given billCode
   *
   * @param reqPayload
   * @returns {Promise<*>}
   */
  async #checkAvailableBill(reqPayload) {
    // prepare jwt token
    let jwtToken = new JWTGenerator().generate();

    // assign signature into payload
    reqPayload.signature = new SignatureGenerator().generate(reqPayload);

    Logger.debug(
      'BillsController::#checkAvailableBill -- Procedure a bill check with payload ',
      reqPayload
    );

    // send POST request to AppotaPay
    let resData = await axios.post(
      APP_SETTINGS.PARTNERS.APPOTAPAY.CONNECTION.API_URI +
      APP_SETTINGS.PARTNERS.APPOTAPAY.ENDPOINTS.BILL_CHECK.ENDPOINT,
      reqPayload,
      {
        headers: {
          'X-APPOTAPAY-AUTH': `${APP_SETTINGS.PARTNERS.APPOTAPAY.HEADERS.AUTH_HEADER_SCHEME} ${jwtToken}`,
          'Content-Type':
            APP_SETTINGS.PARTNERS.APPOTAPAY.HEADERS.AUTH_HEADER_CONTENT_TYPE,
        },
      }
    );

    Logger.debug('BillsController::#checkAvailableBill -- Response: ', resData);

    // persist data into table
    return await BillCheckModel.saveRecordAsync({
      billcode: reqPayload.billCode,
      partner_ref_id: reqPayload.partnerRefId,
      service_code: reqPayload.serviceCode,
      response: resData.data,
    });
  }

  /**
   * Make a request to pay the bill
   *
   * @param req
   * @param res
   * @param next
   * @returns {Promise<*>}
   */
  payment = async (req, res, next) => {
    let billCode = req.body.billcode;
    let serviceCode = req.body.service_code;
    let partnerRefId = req.body.partner_ref_id;
    let amount = req.body.amount;
    let billDetails = '';
    let billData = await BillPaymentModel.getBillDataByPartnerRefId(partnerRefId)

    try {
      // TODO: define a master data to provide the service codes to mobile app
      // TODO: Mobile app needs to pass the service code that depends on the value that user selected to pay the bill

      /**
       * Step 2: check if bill code exists
       */
      if (billData) {

        return res.json(ResponseBuilder.init().withData(billData.response).build());

      } else {
        Logger.debug(
          `\n\nBillsController::payment -- Lookup Bill by billCode:${billCode} serviceCode:${serviceCode} partnerRefId:${partnerRefId}\n`
        );
        let bill = await BillCheckModel.getBillDetailsAsync(
          billCode,
          serviceCode,
          partnerRefId
        );
        Logger.debug('BillsController::payment -- Result: ', bill);

        if (bill && bill.response.errorCode === 0) {
          Logger.debug(
            `BillsController::payment -- Bill does exist, so pay the bill...\n`
          );

          let typeService = new GetJsonData().getServiceCode(serviceCode)
          billDetails = JSON.stringify(bill.response.billDetail);
          let parsedBillDetails = JSON.parse(billDetails);
          let isManyService = typeService === APP_SETTINGS.TYPESERVICE.MANY;
          let isAmountValid = amount >= APP_SETTINGS.MIN_AMOUNT && amount <= parsedBillDetails[0].amount;

          if (typeService === APP_SETTINGS.TYPESERVICE.ONE) {
            if (parsedBillDetails[0].amount === amount) {
              let record = await this.#payBill({
                billCode: billCode,
                partnerRefId: partnerRefId,
                serviceCode: serviceCode,
                amount: amount,
                billDetail: billDetails,
              });
              // response
              return res.json(ResponseBuilder.init().withData(record.response).build());
            } else {
              let record = {
                code: 4002,
                message: 'Số tiền thanh toán không phù hợp.',
              };
              return res.json(ResponseBuilder.init().withData(record).build());
            }
          }
          
          if(isManyService && isAmountValid ) {
            // let record = await this.#payBill({
            //   billCode: billCode,
            //   partnerRefId: partnerRefId,
            //   serviceCode: serviceCode,
            //   amount: amount,
            //   billDetail: billDetails,
            // });
            // return res.json(ResponseBuilder.init().withData(record).build());
            return res.json(ResponseBuilder.init().withData({
              code: 4002,
              message:
                'thanh toán nhiều lần.',
            }).build());
            }

        } else {

          //3. Thông tin thanh toán không hợp lệ, throw error
          Logger.error(
            `===BillsController::payment -- Error while making payment for the bill:${billCode} and partnerRefId:${partnerRefId} and serviceCode:${serviceCode} \n`
          );
          next(
            new RequestValidationError({
              code: 4002,
              message:
                'Thông tin thanh toán không hợp lệ, vui lòng kiểm tra lại Mã hóa đơn & Mã dịch vụ.',
            })
          );
        }
      }
      //end if else

    } catch (error) {
      Logger.error(
        `===BillsController::payment -- Error while making payment for the bill:${billCode} and partnerRefId:${partnerRefId} and serviceCode:${serviceCode} \n`
      );
      Logger.error(error);
      Logger.error(error.response.data);

      await PaymentHistories.saveRecordAsync({
        bill_status: 'Error',
        billCode: billCode ? billCode : '',
        partner_ref_id: partnerRefId ? partnerRefId : '',
        service_code: serviceCode ? serviceCode : '',
        amount: amount ? amount : 0,
        bill_details: billDetails,
        response:
          Object.prototype.toString.call(error.response.data) ===
            '[object Object]'
            ? error.response.data
            : {
              message: error.response.data,
              errorCode: error.response.status,
            },
      });

      await BillPaymentModel.saveRecordAsync({
        bill_status: 'Error',
        billCode: billCode ? billCode : '',
        partner_ref_id: partnerRefId ? partnerRefId : '',
        service_code: serviceCode ? serviceCode : '',
        amount: amount ? amount : 0,
        bill_details: billDetails,
        response:
          Object.prototype.toString.call(error.response.data) ===
            '[object Object]'
            ? error.response.data
            : {
              message: error.response.data,
              errorCode: error.response.status,
            },
      });
      next(error);
    }
  };


  /**
   * Make a request to pay the bill to AppotaPay
   *
   * @param reqPayload
   * @returns {Promise<*>}
   */
  async #payBill(reqPayload) {
    // prepare jwt token
    let jwtToken = new JWTGenerator().generate();

    // assign signature into payload
    reqPayload.signature = new SignatureGenerator().generate(reqPayload);

    Logger.debug(
      'BillsController::#payBill -- Procedure a bill check with payload ',
      reqPayload
    );

    // send POST request to AppotaPay
    let resData = await axios.post(
      APP_SETTINGS.PARTNERS.APPOTAPAY.CONNECTION.API_URI +
      APP_SETTINGS.PARTNERS.APPOTAPAY.ENDPOINTS.BILL_PAYMENT.ENDPOINT,
      reqPayload,
      {
        headers: {
          'X-APPOTAPAY-AUTH': `${APP_SETTINGS.PARTNERS.APPOTAPAY.HEADERS.AUTH_HEADER_SCHEME} ${jwtToken}`,
          'Content-Type':
            APP_SETTINGS.PARTNERS.APPOTAPAY.HEADERS.AUTH_HEADER_CONTENT_TYPE,
        },
      }
    );

    Logger.debug('BillsController::#payBill -- Response: ', resData);
    let billstatus = new GetJsonData().getBillStatus(resData.data.errorCode);
    // persist data into table
    await PaymentHistories.saveRecordAsync({
      bill_status: billstatus,
      billcode: reqPayload.billCode,
      partner_ref_id: reqPayload.partnerRefId,
      service_code: reqPayload.serviceCode,
      amount: reqPayload.amount,
      bill_details: reqPayload.billDetail,
      response: resData.data,
    });

    return await BillPaymentModel.saveRecordAsync({
      bill_status: billstatus,
      billcode: reqPayload.billCode,
      partner_ref_id: reqPayload.partnerRefId,
      service_code: reqPayload.serviceCode,
      amount: reqPayload.amount,
      bill_details: reqPayload.billDetail,
      response: resData.data,
    });
  }


  /**
   * Query the status of a specific transaction
   *
   * @param req
   * @param res
   * @returns {Promise<void>}
   */

  transactions = async (req, res) => {
    try {
      let partner_ref_id = req.params.partner_ref_id;
      let billdata = await BillPaymentModel.getBillDataByPartnerRefId(partner_ref_id);
    
      if (billdata) {
        let validStatuses = ['Success', 'Error', 'Pending', 'Retry'];
        let isSuccessOrError = billdata.bill_status === 'Success' || billdata.bill_status === 'Error';
        let isPendingOrRetry = billdata.bill_status === 'Pending' || billdata.bill_status === 'Retry';
    
        if (validStatuses.includes(billdata.bill_status)) {
          if (isSuccessOrError) {
            return res.json(ResponseBuilder.init().withData(billdata.response).build());
          } else if (isPendingOrRetry) {
            let resData = await this.#getBillTransactions(partner_ref_id);
            let billstatus = new GetJsonData().getBillStatus(resData.data.errorCode);
    
            let record = await TransactionModel.saveRecordAsync({
              bill_status: billstatus,
              partner_ref_id: partner_ref_id,
              response: resData.data,
            });
    
            await BillPaymentModel.updateDataByPartnerRefId(partner_ref_id, {
              response: resData.data,
              bill_status: billstatus,
            });
    
            return res.json(ResponseBuilder.init().withData(record.response).build());
          }
        }
      }
    
      Logger.error(`===BillsController::transactions -- Error:${partner_ref_id} \n`);
      let record = {
        code: 4002,
        message: 'Thông tin thanh toán không hợp lệ, vui lòng kiểm tra lại Mã hóa đơn & Mã dịch vụ.',
      }
      return res.json(ResponseBuilder.init().withData(record).build());
    } catch (error) {
      Logger.error(`===BillsController::transaction -- Error checking transaction:${req.params.partner_ref_id} \n`);
      Logger.error(error.response.data);
    
      await TransactionModel.saveRecordAsync({
        bill_status: 'Error',
        partner_ref_id: req.params.partner_ref_id,
        response: error.response.data,
      });
      return res.json(ResponseBuilder.init().withData(error.response).build());
    }};

  /**
   * Get transaction information
   * @param partnerRefId
   */
  // get transaction status 
  async #getBillTransactions(partnerRefId) {
    let jwtToken = new JWTGenerator().generate();
    const headers = {
      'X-APPOTAPAY-AUTH': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    };

    const resData = await axios.get(
      APP_SETTINGS.PARTNERS.APPOTAPAY.CONNECTION.API_URI +
      APP_SETTINGS.PARTNERS.APPOTAPAY.ENDPOINTS.BILL_TRANSACTIONS
        .ENDPOINT +
      partnerRefId,
      {
        params: {
          partner_ref_id: partnerRefId,
        },
        headers: headers,
      }
    );
    return resData
  }


}

module.exports = new BillsController();
