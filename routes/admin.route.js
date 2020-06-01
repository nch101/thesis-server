var express = require('express');
var router = express.Router();

var userControllers = require('../controllers/user.controller');
var vehicleController = require('../controllers/vehicle.controller');
var intersectionControllers = require('../controllers/intersection.controller');

var intersectionValidate = require('../validates/intersection.validate');

router.post('/intersection', intersectionValidate.nameExists, intersectionControllers.createIntersection);
router.delete('/intersection/:id', intersectionControllers.deleteIntersection);
router.put('/intersection/:id', intersectionControllers.editIntersection);
router.put('/intersection/config-time/:id', intersectionControllers.configTime);


module.exports = router;