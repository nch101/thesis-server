var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');

router.get('/', authController.loginPage);
router.post('/', authController.loginHandle);