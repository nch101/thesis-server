var express = require('express');
var router = express.Router();

var userControllers = require('../controllers/user.controller');
var deviceControllers = require('../controllers/device.controller');
var intersectionControllers = require('../controllers/intersection.controller');

var intersectionValidate = require('../validates/intersection.validate');

router.post('/user/create-user', userControllers.createUser);
router.put('/user/block-user/:id', userControllers.blockedUser);
router.put('/user/unlock-user/:id', userControllers.unlockedUser);
router.delete('/user/delete-user/:id', userControllers.deleteUser);
router.get('/user/get-all', userControllers.getAllUsers);
router.get('/user/get/:id', userControllers.getUser);

router.post('/priority-vehicle/create-device', deviceControllers.createDevice);
router.put('/priority-vehicle/block-device/:id', deviceControllers.blockedDevice);
router.put('/priority-vehicle/unlock-device/:id', deviceControllers.unlockedDevice);
router.delete('/priority-vehicle/delete-device/:id', deviceControllers.deleteDevice);
router.get('/priority-vehicle/get-all', deviceControllers.getAllDevices);

router.post('/intersection/create', intersectionValidate.checkField, intersectionValidate.nameExists, intersectionControllers.createIntersection);
router.delete('/intersection/delete/:id', intersectionControllers.deleteIntersection);
router.put('/intersection/edit/:id', intersectionValidate.checkField, intersectionControllers.editIntersection);
router.put('/intersection/config-time/:id', intersectionControllers.configTime);


module.exports = router;