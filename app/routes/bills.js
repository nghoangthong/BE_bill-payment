const express = require('express');
const router = express.Router();
const BillsController = require('../controller/BillsController');

// router.get('/pay', BillController.bill);
router.get('/check', BillsController.check);
router.get('/pay', BillsController.payment);
router.get('/transaction', BillsController.transactions);
module.exports = router;

