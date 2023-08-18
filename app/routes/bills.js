const express = require('express');
const router = express.Router();
const BillsController = require('../controllers/BillsController');

// POST /v1/bill/check
router.get('/check', BillsController.check);

// POST /v1/bill/payment
router.get('/payment', BillsController.payment);

// GET /v1/bill/transactions
router.get('/transactions', BillsController.transactions);
module.exports = router;

