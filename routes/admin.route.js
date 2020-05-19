var express = require('express');
var router = express.Router();

var userControllers = require('../controllers/user.controller');
var vehicleController = require('../controllers/vehicle.controller');
var intersectionControllers = require('../controllers/intersection.controller');

var intersectionValidate = require('../validates/intersection.validate');

router.post('/user', userControllers.createUser);
router.get('/user', userControllers.getAllUsers);
router.put('/user/blocked/:id', userControllers.blockedUser);
router.put('/user/unlocked/:id', userControllers.unlockedUser);
router.delete('/user/:id', userControllers.deleteUser);

router.post('/vehicle', vehicleController.createVehicle);
router.get('/vehicle/', vehicleController.getAllVehicles);
router.put('/vehicle/blocked/:id', vehicleController.blockedVehicle);
router.put('/vehicle/unblocked/:id', vehicleController.unBlockedVehicle);
router.delete('/vehicle/:id', vehicleController.deleteVehicle);

router.post('/intersection', intersectionValidate.nameExists, intersectionControllers.createIntersection);
router.delete('/intersection/:id', intersectionControllers.deleteIntersection);
router.put('/intersection/:id', intersectionControllers.editIntersection);
router.put('/intersection/config-time/:id', intersectionControllers.configTime);


module.exports = router;