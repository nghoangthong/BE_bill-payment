const express = require('express');
const router = express.Router();
const BillController = require('../controller/BillsController');

router.get('/check', BillController.check);
router.get('/payment', BillController.payment);
router.get('/transactions', BillController.transactions);

module.exports = router;

