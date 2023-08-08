const express = require('express');
const router = express.Router();
const newsController = require('../controller/NewsController');

router.get('/show', newsController.show);
router.get('/create', newsController.create);
router.get('/', newsController.index);

module.exports = router;

