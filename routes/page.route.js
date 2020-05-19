var express = require('express');
var router = express.Router();
var pageController = require('../controllers/page.controller');
var mainValidate = require('../validates/main.validate');

router.get('/', function(req, res) {
	return res
	.status(301)
	.redirect('/login');
});

router.get('/login', pageController.loginOption);
router.get('/vehicle/login', pageController.vehicleLogin);
router.post('/vehicle/login', mainValidate.vehicleValidate);
router.get('/center-control/login', pageController.centerLogin);
router.post('/center-control/login', mainValidate.userValidate);

router.get('/vehicle/direction', pageController.directionPage);

router.get('/vehicle/create', pageController.createVehiclePage);
router.get('/center-control/create', pageController.createCenterControlPage);
router.get('/intersection/create', pageController.createIntersectionPage);

router.get('/intersection/control', pageController.controlPage);

router.post('/intersection/test', function(req, res) {
	return res
	.status(200)
	.json(req.body);
})
router.get('/overview', pageController.overviewPage)

module.exports = router;