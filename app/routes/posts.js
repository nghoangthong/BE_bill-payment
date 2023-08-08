const express = require('express');
const router = express.Router();
const postsController = require('../controller/PostsController');

router.get('/', postsController.index);

module.exports = router;

