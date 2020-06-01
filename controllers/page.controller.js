var vehicleModel = require('../models/vehicle.model');
var intersectionModel = require('../models/intersection.model');
var log4js = require('log4js');
var logger = log4js.getLogger('controllers.page');

module.exports = {

    /**
     * Login page
     */

    loginOption: function(req, res) {
        logger.info('Render login option page');
        return res
        .status(200)
        .render('login/selection.pug');
    },

    vehicleLogin: function(req, res) {
        logger.info('Render vehicle login page');
        return res
        .status(200)
        .render('login/vehicle.pug');
    },

    centerLogin: function(req, res) {
        logger.info('Render control center login page');
        return res
        .status(200)
        .render('login/control-center.pug');
    },

    /**
     * Control center side
     */

    overviewPage: function(req, res) {
        var vehicle = vehicleModel
        .find()
        .select('license_plate vehicleType status timeOn');
        var intersection = intersectionModel
        .find()
        .select('intersectionName modeControl');

        Promise
        .all([vehicle, intersection])
        .then(function(data) {
            logger.info('Render overview page');
            return res
            .status(200)
            .render('control-center/overview.pug', {
                vehiclesData: data[0],
                intersectionsData: data[1]
            })
        })
        .catch(function(error) {
            logger.error('Render overview page error: ', error);
            return res
            .status(501)
            .render('error/index.pug', {
                message: 'Not Implemented',
                code: 501
            });
        })
    },

    createVehiclePage: function(req, res) {
        logger.info('Render create vehicle page');
        return res
        .status(200)
        .render('control-center/create.vehicle.pug');
    },

    createControlCenterPage: function(req, res) {
        logger.info('Render create control center page');
        return res
        .status(200)
        .render('control-center/create.control-center.pug')
    },

    createIntersectionPage: function(req, res) {
        logger.info('Render create intersection page');
        return res
        .status(200)
        .render('control-center/create.intersection.pug')
    },

    controlLightPage: function(req, res) {
        logger.info('Render control light page');
        return res
        .status(200)
        .render('control-center/control.intersection.pug')
    },

    trackingPage: function(req, res) {
        logger.info('Render tracking vehicle page');
        return res
        .status(200)
        .render('control-center/tracking-vehicles.pug')
    },

    /**
     * Vehicle side
     */

    directionPage: function(req, res) {
        logger.info('Render direction page');
        return res
        .status(200)
        .render('vehicle/direction.pug')
    },

}