var express = require('express');
var router = express.Router();
var intersectionControllers = require('../controllers/intersection.controller')

router.get('/', intersectionControllers.getAllIntersections);
router.get('/:id', intersectionControllers.getIntersection);

module.exports = router