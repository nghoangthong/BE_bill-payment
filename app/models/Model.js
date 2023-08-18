const Postgres = require('../libraries/Common/Database/Postgres');
const PgHelper = require("../libraries/Common/Database/PgHelper");

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

    async getRecordByPrimaryKeyAsync(key, value, selectedFields) {
        let selectString = !selectedFields || !Array.isArray(selectedFields) ? '*' : selectedFields.join(', ');
        let query = `SELECT ${selectString} FROM ${this.tableName} WHERE ${key} = $1`;

        let result = await this.model.query(query, [value]);
        return result.rows[0];
    }

    async saveRecordAsync(entity) {
        const {text, values, valuesPattern} = PgHelper.bindInsertQuery(entity);
        const query = `INSERT INTO ${this.tableName}(${text}) VALUES(${valuesPattern}) RETURNING *`;

        const result = await this.model.query(query, values);
        return result.rows[0];
    }
}

module.exports = Model;