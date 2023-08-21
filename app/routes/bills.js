const express = require('express');
const router = express.Router();
const {validateRequestSchema} = require("../middlewares/Common/ValidateRequest");
const {
    validateHeaderSchema,
    validateBillCheckSchema,
    validateBillPaymentSchema
} = require('../libraries/AppotaPay/ValidationSchemas/BillsRequestSchema');
const BillsController = require('../controllers/BillsController');

/**
 * Endpoint: POST /v1/bill/check
 */
router.post('/check',
    /**
     * Step 1: validate headers and request body
     */
    validateRequestSchema('headers', validateHeaderSchema),
    validateRequestSchema('body', validateBillCheckSchema),
    BillsController.check
);

/**
 * Endpoint: POST /v1/bill/payment
 */
router.post('/payment',
    /**
     * Step 1: validate headers and request body
     */
    validateRequestSchema('headers', validateHeaderSchema),
    validateRequestSchema('body', validateBillPaymentSchema),
    BillsController.payment
);

/**
 * Endpoint: GET /v1/bill/transactions
 */
router.get('/transactions', BillsController.transactions);

module.exports = router;

