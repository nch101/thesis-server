var express = require('express');
var router = express.Router();
var mapController = require('../controllers/map.controller');

router.get('/get-token', mapController.accessToken);

module.exports = router;