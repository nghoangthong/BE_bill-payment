const Model = require("./Model");

/**
 * Bill Payment Entity
 */
class Payment extends Model {
  constructor() {
    super("bill_payments");
  }

  
  /**
   * get Bill Data By PartnerRefId
   *
   * @param PartnerRefId
   * @return result.rows[0]
   */
  async getBillDataByPartnerRefId(partnerRefId) {
    const query = `
      SELECT *
      FROM ${this.tableName}
      WHERE partner_ref_id = $1;
    `;
  
    const values = [partnerRefId];
  
    try {
      const result = await this.model.query(query, values);
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      Logger.error("function getBillDataByPartnerRefId | Error retrieving bill data:", error);
      throw error;
    }
  }
  

  /**
   * update Data By PartnerRefId
   *
   * @param partnerRefId, columns, data
   * @return result.rows[0]
   */
  async updateDataByPartnerRefId(partnerRefId, updatedData) {
    const columnValuePairs = Object.keys(updatedData).map((column, index) => {
      return `${column} = $${index + 1}`;
    }).join(', ');
  
    const query = `
      UPDATE ${this.tableName}
      SET ${columnValuePairs}
      WHERE partner_ref_id = $${Object.keys(updatedData).length + 1};
    `;
  
    const values = [...Object.values(updatedData), partnerRefId];
  
    try {
      const result = await this.model.query(query, values);
      Logger.debug(`function updateDataByPartnerRefId | Updated data for partner_ref_id ${partnerRefId}`);
      
      return result.rowCount; 
    } catch (error) {
      Logger.error(" function updateDataByPartnerRefId | Error updating data:", error);
      return 0; 
    }
  }
  
}

module.exports = new Payment();
