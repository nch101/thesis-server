var express = require('express');
var router = express.Router();
var intersectionControllers = require('../controllers/intersection.controller')

router.get('/get-all', intersectionControllers.getAllIntersections);
router.get('/get/:id', intersectionControllers.getIntersection);

module.exports = router