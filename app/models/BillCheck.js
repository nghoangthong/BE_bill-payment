const Model = require("./Model");
const CONSTANT = require('../../config/constant');
/**
 * Bill Check Entity
 */
class BillCheck extends Model {
  constructor() {
    super("bill_checks");
  }

  /**
   * Lookup the bill by bill code
   *
   * @param billCode
   * @returns object
   */
  async getBillByBillCodeAsync(billCode, billTime) {
    billTime = billTime || '30 minutes';
    let sql = `SELECT * FROM ${this.tableName} WHERE billcode = $1 AND created_at >= NOW() - INTERVAL '${billTime}'`;
    let result = await this.model.query(sql, [billCode]);
  
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return false;
  }

  /**
   * Get Bill details by bill code, service code and partner reference id
   *
   * @param sting billCode
   * @param string serviceCode
   * @param string partnerRefId
   * @returns object
   */
  async getBillDetailsAsync(billCode, serviceCode, partnerRefId) {
    let sql = `SELECT * FROM ${this.tableName} WHERE billcode = $1 AND service_code = $2 AND partner_ref_id = $3`;
    let result = await this.model.query(sql, [
      billCode,
      serviceCode,
      partnerRefId,
    ]);

    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return false;
  }
}

module.exports = new BillCheck();
