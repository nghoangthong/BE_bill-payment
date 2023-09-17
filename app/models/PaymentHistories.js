const Model = require("./Model");

/**
 * Bill Payment Entity
 */
class PaymentHistories extends Model {
    constructor() {
        super('payment_histories');
    }
}

module.exports = new PaymentHistories();
