var express = require('express');
var router = express.Router();
var pageController = require('../controllers/page.controller');
var vehicleController = require('../controllers/vehicle.controller');
var mainValidate = require('../validates/main.validate');

/**
 * Login page
 */

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

/**
 * Control center side
 */

router.get('/center/overview/', pageController.overviewPage);
router.get('/center/tracking-vehicle/', vehicleController.trackingVehicle);
router.get('/center/control/', pageController.controlLightPage);
router.get('/center/create-control-center/', pageController.createControlCenterPage);
router.get('/center/create-vehicle/', pageController.createVehiclePage);
router.get('/center/create-intersection/', pageController.createIntersectionPage);

/**
 * Vehicle side
 */

router.get('/vehicle/direction', pageController.directionPage);

module.exports = router;