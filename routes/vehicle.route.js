var express = require('express');
var router = express.Router();
var vehicleController = require('../controllers/vehicle.controller');


router.post('/', vehicleController.createVehicle);
router.get('/:id', vehicleController.getVehicle);

router.put('/:id', vehicleController.editVehicle);
router.put('/change-password/:id', vehicleController.changePassword);

router.get('/location/:id', vehicleController.getLocation);
router.put('/location/:id', vehicleController.updateLocation);

router.put('/:vehicleID/location/:locationID', vehicleController.updateCurrentLocation);

module.exports = router;