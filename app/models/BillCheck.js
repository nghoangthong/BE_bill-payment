const Model = require("./Model");

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
   * @returns {Promise<*>}
   */
  async getBillByBillCodeAsync(billCode) {
    let sql = `SELECT * FROM ${this.tableName} WHERE billcode = $1 AND created_at >= NOW() - INTERVAL '30 minutes'`;
    let result = await this.model.query(sql, [billCode]);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return false;
    }
  }

  /**
   * Get Bill details by bill code, service code and partner reference id
   *
   * @param billCode
   * @param serviceCode
   * @param partnerRefId
   * @returns {Promise<*>}
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
    } else {
      return false;
    }
  }
}

module.exports = new BillCheck();
