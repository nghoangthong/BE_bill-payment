const Postgres = require('../libraries/Common/Database/Postgres');
const PgHelper = require('../libraries/Common/Database/PgHelper');

/**
 * Base model
 */
class Model {
    /**
     * Default constructor
     * @param tableName
     */
    constructor(tableName) {
        this.tableName = tableName;
        this.model = new Postgres();
    }

    /**
     * Lookup a single record by primary key
     *
     * @param key
     * @param value
     * @param selectedFields
     * @returns {Promise<*>}
     */
    async getRecordByPrimaryKeyAsync(key, value, selectedFields) {
        try {
            let selectString = !selectedFields || !Array.isArray(selectedFields) ? '*' : selectedFields.join(', ');
            let query = `SELECT ${selectString} FROM ${this.tableName} WHERE ${key} = $1`;

            let result = await this.model.query(query, [value]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    /**
     * Save data into table
     *
     * @param entity
     * @returns {Promise<*>}
     */
    async saveRecordAsync(entity) {
        try {
            const {text, values, valuesPattern} = PgHelper.bindInsertQuery(entity);
            const query = `INSERT INTO ${this.tableName}(${text}) VALUES(${valuesPattern}) RETURNING *`;

            const result = await this.model.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    //update BillStatus By PartnerRefId
    async updateBillStatusByPartnerRefId(partnerRefId, newStatus) {
        const query = `
          UPDATE ${this.tableName}
          SET bill_status = $1
          WHERE partner_ref_id = $2;
        `;
      
        const values = [newStatus, partnerRefId];
      
        try {
          await this.model.query(query, values);
          console.log(`Updated bill_status for partner_ref_id ${partnerRefId} to ${newStatus}`);
        } catch (error) {
          console.error('Error updating bill_status:', error);
        }
    }

    //get BillData By PartnerRefId
    async getBillDataByPartnerRefId(partnerRefId) {
        const query = `
          SELECT *
          FROM ${this.tableName}
          WHERE partner_ref_id = $1;
        `;
      
        const values = [partnerRefId];
      
        try {
          const result = await this.model.query(query, values);
          return result.rows[0];
        } catch (error) {
          console.error('Error retrieving bill data:', error);
          throw error;
        }
      }
     
      
    // async getBillDataByBillNumber(billnumber) {
    //   const query = `
    //     SELECT *
    //     FROM ${this.tableName}
    //     WHERE bill_number = $1;
    //   `;
    
    //   const values = [billnumber];
    
    //   try {
    //     const result = await this.model.query(query, values);
    //     return result.rows[0];
    //   } catch (error) {
    //     console.error('Error retrieving bill data:', error);
    //     throw error;
    //   }
    // }
      
}

module.exports = Model;