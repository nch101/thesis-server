var express = require('express');
var router = express.Router();
var deviceControllers = require('../controllers/device.controller');


router.get('/:id', deviceControllers.getDevice);

router.put('/:id', deviceControllers.editDevice);
router.put('/change-password/:id', deviceControllers.changePassword);

router.get('/location/:id', deviceControllers.getLocation);
router.put('/location/:id', deviceControllers.updateLocation);

module.exports = router;