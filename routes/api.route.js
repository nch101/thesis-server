var express = require('express');
var router = express.Router();

var apiController = require('../controllers/api.controller');
var intersectionValidate = require('../validates/intersection.validate');
var vehicleController = require('../controllers/vehicle.controller');
var intersectionController = require('../controllers/intersection.controller');

router.get('/vehicle', apiController.getAllVehicles);
router.get('/vehicle/location', vehicleController.getAllCurrentLocation);
router.put('/vehicle/journey', intersectionController.matchIntersection);
router.put('/vehicle/:vehicleID/location/:locationID', vehicleController.updateCurrentLocation);

router.get('/test', function(req, res) {
    return res
    .status(200)
    .render('control-center/test-cam.pug')
})

module.exports = router;