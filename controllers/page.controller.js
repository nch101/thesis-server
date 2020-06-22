var userModel = require('../models/user.model');
var vehicleModel = require('../models/vehicle.model');
var intersectionModel = require('../models/intersection.model');
var tokenModel = require('../models/token.model');
var key = require('../helper/key');

var log4js = require('log4js');
var logger = log4js.getLogger('controllers.page');

function timeGMT7(time) {
    let localTime = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
    + ' ' + time.getHours() + 'h' + time.getMinutes() + 'm' + time.getSeconds() + 's';

    return localTime;
};

function processVehiclesData(vehicles) {
    let nVehiclesActive = 0;
    for (let vehicle of vehicles) {
        if (vehicle.status == 'online') nVehiclesActive++;
    }
    return nVehiclesActive;
};

function processIntersectionData(intersections) {
    let interArr = [];
    let nAutoFixed = 0;
    let nAutoFlexible = 0;
    let nManual = 0;
    let nEmergency = 0;

    let nVL = 0;
    let nL =0;
    let nM = 0;
    let nH = 0;
    let nVH = 0;

    let stateArr = [];
    let modeArr = [];

    for (let interData of intersections) {
        interData = interData.toObject();
        interData.trafficDensity = interData.trafficDensity[interData.trafficDensity.length - 1];
        interData.trafficDensity.date = timeGMT7(interData.trafficDensity.date);
        interArr.push(interData);

        if (interData.trafficDensity.state === 'very-low') nVL++;
        else if (interData.trafficDensity.state === 'low') nL++;
        else if (interData.trafficDensity.state === 'medium') nM++;
        else if (interData.trafficDensity.state === 'high') nH++;
        else if (interData.trafficDensity.state === 'very-high') nVH++;

        if (interData.modeControl === 'automatic-flexible-time') nAutoFlexible++;
        else if (interData.modeControl === 'automatic-fixed-time') nAutoFixed++;
        else if (interData.modeControl === 'manual') nManual++;
        else if (interData.modeControl === 'emergency') nEmergency++;
    }

    stateArr.push(nVL, nL, nM, nH, nVH);
    modeArr.push(nAutoFlexible, nAutoFixed, nManual, nEmergency);
    return [interArr, stateArr, modeArr];
};

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
            .clearCookie('mapToken')
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
        let vehicle = vehicleModel
        .find()
        .select('license_plate vehicleType status timeOn');
        let intersection = intersectionModel
        .find()
        .select('intersectionName modeControl trafficDensity');

        Promise
        .all([vehicle, intersection])
        .then(function(data) {
            let processInterData = processIntersectionData(data[1]);
            logger.info('Render overview page');
            return res
            .status(200)
            .render('control-center/overview.pug', {
                name: res.locals.name,
                vehiclesData: data[0],
                intersectionsData: processInterData[0],
                nVehiclesActive: processVehiclesData(data[0]),
                nState: processInterData[1],
                nMode: processInterData[2]
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
        .cookie('mapToken', key.mapToken)
        .render('control-center/create.intersection.pug', {
            name: res.locals.name,
        })
    },

    controlLightPage: function(req, res) {
        logger.info('Render control light page');
        return res
        .status(200)
        .cookie('mapToken', key.mapToken)
        .render('control-center/control.intersection.pug', {
            name: res.locals.name,
        })
    },

    trackingPage: function(req, res) {
        logger.info('Render tracking vehicle page');
        return res
        .status(200)
        .cookie('mapToken', key.mapToken)
        .render('control-center/tracking-vehicles.pug', {
            name: res.locals.name,
        })
    },

    statisticPage: function(req, res) {
        logger.info('Render statistic page');
        return res
        .status(200)
        .render('control-center/statistic.pug');
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