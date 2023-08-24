const express = require('express');
const router = express.Router();
const ServicesController = require('../controllers/ServicesController');
const {validateServiceParams} = require('../libraries/AppotaPay/ValidationSchemas/ServicesRequestSchema');
const {validateRequestSchema} = require("../middlewares/Common/ValidateRequest");

/**
 * Endpoint: GET /v1/services
 */
router.get('/services', ServicesController.serviceCategories);

/**
 * Endpoint: GET /v1/services/:service_id
 */
router.get('/services/:service_id',
    validateRequestSchema('params', validateServiceParams),
    ServicesController.services);


module.exports = router;