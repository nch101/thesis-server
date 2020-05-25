var vehicleModel = require('../models/vehicle.model');
var intersectionModel = require('../models/intersection.model');
var log4js = require('log4js');
var logger = log4js.getLogger('controllers.page');

module.exports = {

    /** Login page controller **/

    loginOption: function(req, res) {
        return res
        .status(200)
        .render('auth/main-login');
    },

    vehicleLogin: function(req, res) {
        return res
        .status(200)
        .render('auth/vehicle-login')
    },

    centerLogin: function(req, res) {
        return res
        .status(200)
        .render('auth/center-login');
    },

    /** End of login page controller **/

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
            logger.info('In overviewPage function: success');
            return res
            .status(200)
            .render('center-control/overview.pug', {
                vehiclesData: data[0],
                intersectionsData: data[1]
            })
        })
        .catch(function(error) {
            logger.error('In overviewPage function: ', error);
            return res
            .status(501)
            .json('error');
        })
    },

    /** Create page controller **/

    createVehiclePage: function(req, res) {
        return res
        .status(200)
        .render('center-control/vehicle.create.pug');
    },

    createCenterControlPage: function(req, res) {
        return res
        .status(200)
        .render('center-control/center.create.pug')
    },

    createIntersectionPage: function(req, res) {
        return res
        .status(200)
        .render('center-control/intersection.create.pug')
    },

    /** End of create page controller **/

    /** Control page controller **/

    controlPage: function(req, res) {
        return res
        .status(200)
        .render('center-control/intersection.control.pug')
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
        .render('center-control/tracking-vehicles.pug')
    },

}