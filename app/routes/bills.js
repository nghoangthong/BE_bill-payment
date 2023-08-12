const express = require('express');
const router = express.Router();
const BillControllers = require('../controller/BillsController');

// router.get('/pay', BillController.bill);
router.get('/check', BillControllers.check);
router.get('/pay', BillControllers.payment);
router.get('/transaction', BillControllers.transactions);
module.exports = router;

