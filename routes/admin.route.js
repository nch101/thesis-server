var express = require('express');
var router = express.Router();

var userControllers = require('../controllers/user.controller');
var deviceControllers = require('../controllers/device.controller');
var intersectionControllers = require('../controllers/intersection.controller');

var intersectionValidate = require('../validates/intersection.validate');

router.post('/user', userControllers.createUser);
router.get('/user', userControllers.getAllUsers);
router.put('/user/blocked/:id', userControllers.blockedUser);
router.put('/user/unlocked/:id', userControllers.unlockedUser);
router.delete('/user/:id', userControllers.deleteUser);

router.post('/device', deviceControllers.createDevice);
router.get('/device/', deviceControllers.getAllDevices);
router.put('/device/blocked/:id', deviceControllers.blockedDevice);
router.put('/device/unblocked/:id', deviceControllers.unBlockedDevice);
router.delete('/device/:id', deviceControllers.deleteDevice);

router.post('/intersection', intersectionValidate.nameExists, intersectionControllers.createIntersection);
router.delete('/intersection/:id', intersectionControllers.deleteIntersection);
router.put('/intersection/:id', intersectionControllers.editIntersection);
router.put('/intersection/config-time/:id', intersectionControllers.configTime);


module.exports = router;