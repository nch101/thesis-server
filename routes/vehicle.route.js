var express = require('express');
var router = express.Router();
var vehicleController = require('../controllers/vehicle.controller');


router.get('/:id', vehicleController.getVehicle);

router.put('/:id', vehicleController.editVehicle);
router.put('/change-password/:id', vehicleController.changePassword);

router.get('/location/:id', vehicleController.getLocation);
router.put('/location/:id', vehicleController.updateLocation);



module.exports = router;