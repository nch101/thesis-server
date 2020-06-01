var express = require('express');
var router = express.Router();
var intersectionController = require('../controllers/intersection.controller')
var intersectionValidate = require('../validates/intersection.validate');

router.post('/', intersectionValidate.nameExists, intersectionController.createIntersection);
router.get('/', intersectionController.getAllIntersections);
router.get('/:id', intersectionController.getIntersection);
router.put('/:id', intersectionController.configTime);

module.exports = router