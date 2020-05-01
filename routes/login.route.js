var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.redirect(301, '/login');
});

router.get('/login', function(req, res) {
	res
	.status(200)
	.render('auth/main-login');
});

router.get('/vehicle/login', function(req, res) {
	res
	.status(200)
	.render('auth/vehicle-login')
});

router.get('/center-control/login', function(req, res) {
	res
	.status(200)
	.render('auth/center-login');
})

module.exports = router;