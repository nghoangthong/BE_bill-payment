const Model = require("./Model");

/**
 * Bill Payment Entity
 */
class Transactions extends Model {
    constructor() {
        super('transactions');
    }
}

module.exports = new Transactions();
