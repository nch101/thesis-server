var express = require('express');
var router = express.Router();
var intersectionControllers = require('../controllers/intersection.controller')

router.get('/', intersectionControllers.getAllIntersections);
router.get('/:id', intersectionControllers.getIntersection);
router.put('/mode-control/:id', intersectionControllers.updateModeControl);
router.get('/get-data/:id', intersectionControllers.getData);

module.exports = router