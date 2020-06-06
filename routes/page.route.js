var express = require('express');
var router = express.Router();
var pageController = require('../controllers/page.controller');
var vehicleController = require('../controllers/vehicle.controller');
var userValidate = require('../validates/user.validate');
var userMiddleware = require('../middleware/user.middleware');

var vehicleValidate = require('../validates/vehicle.validate');
var vehicleMiddleware = require('../middleware/vehicle.middleware');

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
router.post('/vehicle/login', vehicleValidate.vehicleValidate);
router.get('/center-control/login', pageController.centerLogin);
router.post('/center-control/login', userValidate.userValidate);

/**
 * Logout
 */

router.get('/vehicle/logout', vehicleMiddleware.vehicleMiddleware, pageController.vehicleLogout);
router.get('/center/logout', userMiddleware.userMiddleware, pageController.centerLogout);

/**
 * Control center side
 */

router.get('/center/overview/', userMiddleware.userMiddleware, pageController.overviewPage);
router.get('/center/tracking-vehicle/', userMiddleware.userMiddleware, vehicleController.trackingVehicle);//
router.get('/center/control/', userMiddleware.userMiddleware, pageController.controlLightPage);
router.get('/center/create-control-center/', userMiddleware.userMiddleware, pageController.createControlCenterPage);
router.get('/center/create-vehicle/', userMiddleware.userMiddleware, pageController.createVehiclePage);
router.get('/center/create-intersection/', userMiddleware.userMiddleware, pageController.createIntersectionPage);
router.get('/center/list/managers', userMiddleware.userMiddleware, pageController.listManagers);
router.get('/center/list/vehicles', userMiddleware.userMiddleware, pageController.listVehicles);


/**
 * Vehicle side
 */

router.get('/vehicle/direction', vehicleMiddleware.vehicleMiddleware, pageController.directionPage);

module.exports = router;