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
            if (result.rows.length > 0) {
                return result.rows[0];
              }
            return false;
        } catch (error) {
            Logger.error('function getRecordByPrimaryKeyAsync | error:',error)
            return false;
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
            if (result.rows.length > 0) {
                return result.rows[0];
              }
            return false;
        } catch (error) {
            Logger.error('function saveRecordAsync | error:', error)
            return false
        }
    }
      
}

module.exports = Model;