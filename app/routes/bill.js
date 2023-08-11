const express = require('express');
const router = express.Router();
const BillController = require('../controller/BillController');

// router.get('/pay', BillController.bill);
router.get('/check', BillController.check);
router.get('/pay', BillController.pay);
router.get('/transaction', BillController.transaction);
module.exports = router;

