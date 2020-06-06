var userModel = require('../models/user.model');
var vehicleModel = require('../models/vehicle.model');
var intersectionModel = require('../models/intersection.model');
var tokenModel = require('../models/token.model');
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
     * Logout
     */

    vehicleLogout: function(req, res) {
        tokenModel
        .findOneAndDelete({ refreshToken: req.cookies.refreshToken })
        .then(function(data) {
            vehicleModel
            .findByIdAndUpdate(res.locals.id, { $set: { status: 'offline' }})
            .catch(function(error) {
                logger.error('Vehicle %s logout error: %s', res.locals.id, error);
                return res
                .status(501)
                .render('error/index.pug', {
                    code: 501,
                    message: 'Not Implemented'
                });
            });
            
            logger.info('Vehicle %s logout', res.locals.id);
            return res
            .status(304)
            .clearCookie('refreshToken')
            .clearCookie('accessToken')
            .clearCookie('vehicleId')
            .clearCookie('locId')
            .clearCookie('io')
            .clearCookie('mapToken')
            .redirect('/login');
        })
        .catch(function(error) {
            logger.error('Vehicle %s logout error %s', res.locals.id, error);
            return res
            .status(501)
            .render('error/index.pug', {
                code: 501,
                message: 'Not Implemented'
            })
        })
    },

    centerLogout: function(req, res) {
        tokenModel
        .findOneAndDelete({ refreshToken: req.cookies.refreshToken })
        .then(function(data) {
            userModel
            .findByIdAndUpdate(res.locals.id, { $set: { status: 'offline' }})
            .catch(function(error) {
                logger.error('Control center %s logout error: %s', res.locals.id, error);
                return res
                .status(501)
                .render('error/index.pug', {
                    code: 501,
                    message: 'Not Implemented'
                });
            });
            
            logger.info('User %s logout', res.locals.id);
            return res
            .status(304)
            .clearCookie('refreshToken')
            .clearCookie('accessToken')
            .clearCookie('io')
            .redirect('/login');
        })
        .catch(function(error) {
            logger.error('User %s logout error %s', res.locals.id, error);
            return res
            .status(501)
            .render('error/index.pug', {
                code: 501,
                message: 'Not Implemented'
            })
        })
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
                name: res.locals.name,
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
        .render('control-center/create.vehicle.pug', {
            name: res.locals.name,
        });
    },

    createControlCenterPage: function(req, res) {
        logger.info('Render create control center page');
        return res
        .status(200)
        .render('control-center/create.control-center.pug', {
            name: res.locals.name,
        })
    },

    createIntersectionPage: function(req, res) {
        logger.info('Render create intersection page');
        return res
        .status(200)
        .render('control-center/create.intersection.pug', {
            name: res.locals.name,
        })
    },

    controlLightPage: function(req, res) {
        logger.info('Render control light page');
        return res
        .status(200)
        .render('control-center/control.intersection.pug', {
            name: res.locals.name,
        })
    },

    trackingPage: function(req, res) {
        logger.info('Render tracking vehicle page');
        return res
        .status(200)
        .render('control-center/tracking-vehicles.pug', {
            name: res.locals.name,
        })
    },

    listManagers: function(req, res) {
        userModel
        .find()
        .select('firstname lastname phone email status blocked')
        .then(function(data) {
            if (data) {
                logger.info('Render list managers page');
                return res
                .status(200)
                .render('control-center/list.managers.pug', {
                    name: res.locals.name,
                    managers: data
                });
            }
            else {
                logger.warn('Managers data not found');
                return res
                .status(404)
                .render('error/index.pug', {
                    code: 404,
                    message: 'Not found'
                });
            }
        })
        .catch(function(error) {
            logger.error('Render list managers page error ', error);
            return res
            .status(501)
            .render('error/index.pug', {
                code: 501,
                message: 'Not Implemented'
            });
        });
    },

    listVehicles: function(req, res) {
        vehicleModel
        .find()
        .select('license_plate vehicleType phone address company status blocked')
        .then(function(data) {
            if (data) {
                logger.info('Render list vehicles page');
                return res
                .status(200)
                .render('control-center/list.vehicles.pug', {
                    name: res.locals.name,
                    vehicles: data
                });
            }
            else {
                logger.warn('Vehicles data not found');
                return res
                .status(404)
                .render('error/index.pug', {
                    code: 404,
                    message: 'Not found'
                });
            }
        })
        .catch(function(error) {
            logger.error('Render list vehicles page error ', error);
            return res
            .status(501)
            .render('error/index.pug', {
                code: 501,
                message: 'Not Implemented'
            });
        });
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