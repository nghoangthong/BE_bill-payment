const BillCheckModel = require('../models/BillCheck');
const BillPaymentModel = require('../models/PayMent');
const TransactionModel = require('../models/Transactions');
const PaymentHistories = require('../models/PaymentHistories');
const { v4: uuidv4 } = require('uuid');

const JWTGenerator = require('../libraries/AppotaPay/JWTGenerator');
const SignatureGenerator = require('../libraries/AppotaPay/SignatureGenerator');
const ResponseBuilder = require('../libraries/Common/Builders/ResponseBuilder');
const RequestValidationError = require('../libraries/Exception/RequestValidationError');
const GetJsonData = require('../libraries/AppotaPay/GetJsonData');
const HTTPRequests = require('../libraries/AppotaPay/httpRequests')
const CONSTANT = require('../../config/constant')

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
   * @returns Json
   */
  check = async (req, res, next) => {
    let billCode = req.body.billcode;
    let serviceCode = req.body.service_code;
    let partnerRefId = uuidv4();

    try {
      Logger.debug(
        `\n\nBillsController::check -- Lookup Bill by Bill Code ${billCode}\n`
      );
      let bill = await BillCheckModel.getBillByBillCodeAsync(billCode);
      Logger.debug('BillsController::check -- Result: ', bill);

      if (bill) {
        return res.json(ResponseBuilder.init().withData(bill).build());
      }
      Logger.debug(
        `BillsController::check -- Bill does not exist, checking with AppotaPay...\n`
      );

      let record = await this.#checkAvailableBill({
        billCode: billCode,
        partnerRefId: partnerRefId,
        serviceCode: serviceCode,
      });

      // response
      return res.json(ResponseBuilder.init().withData(record).build());
      
    } catch (error) {
      Logger.error(
        `===BillsController::check -- Error while checking the bill:${billCode} and partnerRefId:${partnerRefId} and serviceCode:${serviceCode} \n`
      );
      Logger.error(error);
      let data = {
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
      }
      await BillCheckModel.saveRecordAsync(data);
      next(error);
    }
  };

  /**
   * Private function: to check available bill for the given billCode
   *
   * @param reqPayload
   * @returns object
   */
  async #checkAvailableBill(reqPayload) {
    let jwtToken = new JWTGenerator().generate();
    reqPayload.signature = new SignatureGenerator().generate(reqPayload);

    Logger.debug(
      'BillsController::#checkAvailableBill -- Procedure a bill check with payload ',
      reqPayload
    );
    
    let resData = await HTTPRequests.checkInfoFromGetWay(jwtToken, reqPayload)

    Logger.debug('BillsController::#checkAvailableBill -- Response: ', resData);
    let data = {
      billcode: reqPayload.billCode,
      partner_ref_id: reqPayload.partnerRefId,
      service_code: reqPayload.serviceCode,
      response: resData.data,
    }
    // persist data into table
    return await BillCheckModel.saveRecordAsync(data);
  }

  /**
   * Make a request to pay the bill
   *
   * @param req
   * @param res
   * @param next
   * @returns Json
   */
  payment = async (req, res, next) => {
    let billCode = req.body.billcode;
    let serviceCode = req.body.service_code;
    let partnerRefId = req.body.partner_ref_id;
    let amount = req.body.amount;
    let billDetails = '';
    let billData = await BillPaymentModel.getBillDataByPartnerRefId(partnerRefId)

    try {

      if (billData) {
        return res.json(ResponseBuilder.init().withData(billData.response).build());

      }
      Logger.debug(
        `BillsController::payment -- Lookup Bill by billCode:${billCode} serviceCode:${serviceCode} partnerRefId:${partnerRefId}`
      );
      let bill = await BillCheckModel.getBillDetailsAsync(
        billCode,
        serviceCode,
        partnerRefId
      );
      Logger.debug('BillsController::payment -- Result: ', bill);

      if (bill && bill.response.errorCode === 0) {
        Logger.debug(
          `BillsController::payment -- Bill does exist, so pay the bill...`
        );

        let typeService = new GetJsonData().getServiceCode(serviceCode);
        billDetails = JSON.stringify(bill.response.billDetail);
        let parsedBillDetails = JSON.parse(billDetails);

        if (typeService == CONSTANT.BILL_DETAIL.TYPE_SERVICE.ONE) {
          if (parsedBillDetails[0].amount === amount) {
            let data = {
              billCode: billCode,
              partnerRefId: partnerRefId,
              serviceCode: serviceCode,
              amount: amount,
              billDetail: billDetails,
            };
            let record = await this.#payBill(data);
            // response
            return res.json(ResponseBuilder.init().withData(record.response).build());
          }
          
          let record = {
            code: 4002,
            message: 'Số tiền thanh toán không phù hợp.',
          };
          return res.json(ResponseBuilder.init().withData(record).build());
        };
        };
        let isManyService = typeService === CONSTANT.BILL_DETAIL.TYPE_SERVICE.MANY;
        let isAmountValid = amount >= CONSTANT.BILL_DETAIL.MIN_AMOUNT && amount <= parsedBillDetails[0].amount;
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

    } catch (error) {
      Logger.error(
        `===BillsController::payment -- Error while making payment for the bill:${billCode} and partnerRefId:${partnerRefId} and serviceCode:${serviceCode} \n`
      );
      Logger.error(error);
      Logger.error(error.response.data);
      let data = {
        bill_status: CONSTANT.BILL_DETAIL.BILL_STATUS.ERROR,
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
      }

      await PaymentHistories.saveRecordAsync(data);
      await BillPaymentModel.saveRecordAsync(data);

      next(error);
    }
  };


  /**
   * Make a request to pay the bill to AppotaPay
   *
   * @param reqPayload
   * @returns object
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
    let resData = await HTTPRequests.payBillInfoFromGetWay(jwtToken, reqPayload)
    let billstatus = new GetJsonData().getBillStatus(resData.data.errorCode);

    Logger.debug('BillsController::#payBill -- Response: ', resData);

    // persist data into table
     let data = {
      bill_status: billstatus,
      billcode: reqPayload.billCode,
      partner_ref_id: reqPayload.partnerRefId,
      service_code: reqPayload.serviceCode,
      amount: reqPayload.amount,
      bill_details: reqPayload.billDetail,
      response: resData.data,
    } 

    await PaymentHistories.saveRecordAsync(data);

    return await BillPaymentModel.saveRecordAsync(data);
  }


  /**
   * Query the status of a specific transaction
   *
   * @param req
   * @param res
   * @returns Json
   */

  transactions = async (req, res) => {
    try {
      let partner_ref_id = req.params.partner_ref_id;
      let billdata = await BillPaymentModel.getBillDataByPartnerRefId(partner_ref_id);
      if (billdata) {
        let validStatuses = [CONSTANT.BILL_DETAIL.BILL_STATUS.SUCCESS,
          CONSTANT.BILL_DETAIL.BILL_STATUS.ERROR,
          CONSTANT.BILL_DETAIL.BILL_STATUS.PENDING,
          CONSTANT.BILL_DETAIL.BILL_STATUS.RETRY];
        
        let isSuccessStatus = billdata.bill_status === CONSTANT.BILL_DETAIL.BILL_STATUS.SUCCESS;
        let isErrorStatus = billdata.bill_status === CONSTANT.BILL_DETAIL.BILL_STATUS.ERROR;
        let isPendingStatus = billdata.bill_status === CONSTANT.BILL_DETAIL.BILL_STATUS.PENDING;
        let isRetryStatus =  billdata.bill_status === CONSTANT.BILL_DETAIL.BILL_STATUS.RETRY;
    
        if (validStatuses.includes(billdata.bill_status)) {
          if (isSuccessStatus || isErrorStatus) {
            return res.json(ResponseBuilder.init().withData(billdata.response).build());
          } 
          if (isPendingStatus || isRetryStatus) {
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
        bill_status: CONSTANT.BILL_DETAIL.BILL_STATUS.ERROR,
        partner_ref_id: req.params.partner_ref_id,
        response: error.response.data,
      });
      return res.json(ResponseBuilder.init().withData(error.response).build());
    }};

  /**
   * Get transaction information
   * @param partnerRefId
   * return object
   */

  async #getBillTransactions(partnerRefId) {
    let jwtToken = new JWTGenerator().generate();
    return HTTPRequests.transactionsInfoFromGetWay(partnerRefId, jwtToken)
  };


};

module.exports = new BillsController();
