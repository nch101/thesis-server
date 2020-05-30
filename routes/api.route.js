var express = require('express');
var router = express.Router();

var apiController = require('../controllers/api.controller');
var intersectionValidate = require('../validates/intersection.validate');
var vehicleController = require('../controllers/vehicle.controller');

router.post('/intersection', intersectionValidate.nameExists, apiController.createIntersection);
router.get('/intersection/', apiController.getAllIntersections);
router.get('/intersection/:id', apiController.getIntersection);
router.put('/intersection/:id', apiController.configTime);

router.get('/vehicle/location', vehicleController.getAllCurrentLocation);
router.put('/vehicle/journey', apiController.matchIntersection);
router.get('/vehicle', apiController.getAllVehicles);

router.get('/test', function(req, res) {
    console.log(req.body)
    return res
    .status(200)
    .render('center-control/test-cam.pug')
})

module.exports = router;