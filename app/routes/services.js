const express = require('express');
const router = express.Router();
const ServicesController = require('../controllers/ServicesController');

/**
 * Endpoint: GET /v1/services
 */
router.get('/services', ServicesController.services);

/**
 * Endpoint: GET /v1/services/:service_id
 */
router.get('/services/:service_id', ServicesController.services);

module.exports = router;