var express = require('express');
var router = express.Router();

var userControllers = require('../controllers/user.controller');
var deviceControllers = require('../controllers/device.controller');
var intersectionControllers = require('../controllers/intersection.controller');
var trafficLightControllers = require('../controllers/trafficLight.controller');

var intersectionValidate = require('../validates/intersection.validate');
var validates = require('../validates/validates');

router.post('/user/create-user', userControllers.createUser);
router.put('/user/block-user/:id', validates.idHas, userControllers.blockedUser);
router.put('/user/unlock-user/:id', validates.idHas, userControllers.unlockedUser);
router.delete('/user/delete-user/:id', validates.idHas, userControllers.deleteUser);
router.get('/user/get-all', userControllers.getAllUsers);
router.get('/user/get/:id', validates.idHas, userControllers.getUser);

router.post('/priority-vehicle/create-device', deviceControllers.createDevice);
router.put('/priority-vehicle/block-device/:id', validates.idHas, deviceControllers.blockedDevice);
router.put('/priority-vehicle/unlock-device/:id', validates.idHas, deviceControllers.unlockedDevice);
router.delete('/priority-vehicle/delete-device/:id', validates.idHas, deviceControllers.deleteDevice);
router.get('/priority-vehicle/get-all', deviceControllers.getAllDevices);

router.post('/intersection/create', intersectionValidate.checkField, intersectionValidate.nameExists, intersectionControllers.createIntersection);
router.delete('/intersection/delete/:id', validates.idHas, intersectionControllers.deleteIntersection);
router.post('/intersection/edit/:id', validates.idHas, intersectionValidate.checkField, intersectionControllers.editIntersection);

router.get('/traffic-light/:id', validates.idHas, trafficLightControllers.getTrafficLight);


module.exports = router;