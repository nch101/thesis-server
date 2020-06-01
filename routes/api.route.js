var express = require('express');
var router = express.Router();

var apiController = require('../controllers/api.controller');
var intersectionValidate = require('../validates/intersection.validate');
var vehicleController = require('../controllers/vehicle.controller');
var intersectionController = require('../controllers/intersection.controller');

router.post('/intersection', intersectionValidate.nameExists, intersectionController.createIntersection);
router.get('/intersection/', intersectionController.getAllIntersections);
router.get('/intersection/:id', intersectionController.getIntersection);
router.put('/intersection/:id', intersectionController.configTime);

router.get('/vehicle', apiController.getAllVehicles);
router.get('/vehicle/location', vehicleController.getAllCurrentLocation);
router.put('/vehicle/journey', intersectionController.matchIntersection);
router.put('/vehicle/:vehicleID/location/:locationID', vehicleController.updateCurrentLocation);

router.get('/test', function(req, res) {
    console.log(req.body)
    return res
    .status(200)
    .render('center-control/test-cam.pug')
})

module.exports = router;