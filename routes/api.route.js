var express = require('express');
var router = express.Router();

var apiController = require('../controllers/api.controller');

router.get('/intersection/', apiController.getAllIntersections);
router.get('/intersection/:id', apiController.getIntersection);

module.exports = router;