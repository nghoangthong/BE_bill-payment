const Model = require("./Model");

class BillCheck extends Model {
    constructor() {
        super('bill_checks');
    }

    /**
     * Lookup the bill by bill code
     *
     * @param billCode
     * @returns {Promise<*>}
     */
    async getBillByBillCodeAsync(billCode) {
        let sql = `SELECT * FROM ${this.tableName} WHERE bill_code = $1 AND created_date >= NOW() - INTERVAL '5 minutes'`;
        let result = await this.model.query(sql, [value]);

        return result.rows[0];
    }
}

module.exports = new BillCheck();