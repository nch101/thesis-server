var express = require('express');
var router = express.Router();
var intersectionControllers = require('../controllers/intersection.controller')

router.get('/get-all', intersectionControllers.getAllIntersections);
router.get('/get/:id', intersectionControllers.getIntersection);
router.put('/mode-control/manual/:id', intersectionControllers.updateManualControl);
router.put('/mode-control/automatic/:id', intersectionControllers.updateAutomaticControl);
router.get('/get-data/:id', intersectionControllers.getData);

module.exports = router