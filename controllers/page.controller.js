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
        .render('control-center/vehicle.create.pug');
    },

    createCenterControlPage: function(req, res) {
        logger.info('Render create control center page');
        return res
        .status(200)
        .render('control-center/center.create.pug')
    },

    createIntersectionPage: function(req, res) {
        logger.info('Render create intersection page');
        return res
        .status(200)
        .render('control-center/intersection.create.pug')
    },

    /** End of create page controller **/

    /** Control page controller **/

    controlPage: function(req, res) {
        return res
        .status(200)
        .render('control-center/intersection.control.pug')
    },

    /** End of control page controller **/

    /** Direction page **/

    directionPage: function(req, res) {
        return res
        .status(200)
        .render('vehicle/direction.pug')
    },

    /** End of direction page **/

    /**
     * Tracking vehicles page
     */

    trackingPage: function(req, res) {
        return res
        .status(200)
        .render('control-center/tracking-vehicles.pug')
    },

}