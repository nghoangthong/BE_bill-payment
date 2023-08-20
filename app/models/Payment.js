const Model = require("./Model");

/**
 * Bill Payment Entity
 */
class Payment extends Model {
    constructor() {
        super('bill_payments');
    }
}

module.exports = new Payment();
