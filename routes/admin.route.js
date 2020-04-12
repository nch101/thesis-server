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

router.post('/device/', deviceControllers.createDevice);
router.get('/device/', deviceControllers.getAllDevices);
router.put('/device/blocked/:id', deviceControllers.blockedDevice);
router.put('/device/unblocked/:id', deviceControllers.unBlockedDevice);
router.delete('/device/:id', deviceControllers.deleteDevice);

router.post('/intersection', intersectionValidate.checkField, intersectionValidate.nameExists, intersectionControllers.createIntersection);
router.delete('/intersection/:id', intersectionControllers.deleteIntersection);
router.put('/intersection/:id', intersectionValidate.checkField, intersectionControllers.editIntersection);
router.put('/intersection/config-time/:id', intersectionControllers.configTime);


module.exports = router;