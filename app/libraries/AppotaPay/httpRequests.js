const axios = require("axios");

class HTTPRequests {

    /**
   * fetch Bill Transactions Data
   *
   * @param partnerRefId
   * @param jwtToken
   * @returns Json
   */
  async fetchBillTransactionsData(partnerRefId, jwtToken) {
    const resData = await axios.get(
      APP_SETTINGS.PARTNERS.APPOTAPAY.CONNECTION.API_URI +
        APP_SETTINGS.PARTNERS.APPOTAPAY.ENDPOINTS.BILL_TRANSACTIONS.ENDPOINT +
        partnerRefId,
      {
        params: {
          partner_ref_id: partnerRefId,
        },
        headers: {
            'X-APPOTAPAY-AUTH': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
      }
    );
    return resData;
  }


    /**
   * fetch Pay Bill Data
   *
   * @param reqPayload
   * @param jwtToken
   * @returns Json
   */
  async fetchPayBillData(jwtToken, reqPayload) {
    const resData = await axios.post(
      APP_SETTINGS.PARTNERS.APPOTAPAY.CONNECTION.API_URI +
        APP_SETTINGS.PARTNERS.APPOTAPAY.ENDPOINTS.BILL_PAYMENT.ENDPOINT,
      reqPayload,
      {
        headers: {
          "X-APPOTAPAY-AUTH": `${APP_SETTINGS.PARTNERS.APPOTAPAY.HEADERS.AUTH_HEADER_SCHEME} ${jwtToken}`,
          "Content-Type":
            APP_SETTINGS.PARTNERS.APPOTAPAY.HEADERS.AUTH_HEADER_CONTENT_TYPE,
        },
      }
    );
    return resData;
  }

    /**
   * fetch Check Data
   *
   * @param reqPayload
   * @param jwtToken
   * @returns Json
   */
  async fetchCheckData(jwtToken, reqPayload){
    return await axios.post(
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
  }
}
module.exports = new HTTPRequests();
