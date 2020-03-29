var express = require('express');
var router = express.Router();
var trafficLightControllers = require('../controllers/trafficLight.controller');

router.get('/get/:id', trafficLightControllers.getTrafficLight);

module.exports = router;