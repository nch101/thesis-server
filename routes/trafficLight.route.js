var express = require('express');
var router = express.Router();
var trafficLightControllers = require('../controllers/trafficLight.controller');

router.get('/get/:id', trafficLightControllers.getTrafficLight);
router.get('/get-data/:id', trafficLightControllers.getData);

module.exports = router;