var intersectionModel = require('../models/intersection.model');
var trafficLightModel = require('../models/traffic-light.model');
var vehicleModel = require('../models/vehicle.model');
var userModel = require('../models/user.model');

var log4js = require('log4js');
var log = log4js.getLogger('api-controller');

function preProcessLocationData(locationDataString) {
    var locationDataArray = locationDataString.split(',');
    var locationData = {
        'type': 'Point',
        'coordinates': [locationDataArray[0], locationDataArray[1]]
    }
    return locationData;
}

module.exports = {
    createIntersection: function(req, res) {
        log.info('In createIntersection')
        var intersection = new intersectionModel({
            intersectionName: req.body.intersectionName,
            location: preProcessLocationData(req.body.locations[0]),
            delta: req.body.delta
        });
        for (var index in  req.body.bearings) {
            var trafficLight = new trafficLightModel({
                intersectionId: intersection._id,
                streetName: req.body.streetNames[index],
                location: preProcessLocationData(req.body.locations[index]), 
                bearing: req.body.bearings[index],
                timeRed: req.body.timeReds[index],
                timeYellow: req.body.timeYellows[index],
                timeGreen: req.body.timeGreens[index]
            });
            intersection.trafficLights.push(trafficLight._id);
            trafficLight.save()
            .catch(function(error) {
                log.error('trafficLightModel: ', error);
                return res
                .status(200)
                .json({
                    status: 'error', 
                    message: 'Khởi tạo thất bại!'
                })
            })
        }
        intersection.save()
        .then(function(results) {
            log.debug('Successful');
            return res
            .status(200)
            .json({
                status: 'success', 
                message: 'Khởi tạo thành công!'
            })
        })
        .catch(function(error) {
            log.error('intersectionModel: ', error);
            return res
            .status(200)
            .json({
                status: 'error', 
                message: 'Khởi tạo thất bại!'
            })
        })
    },

    getAllIntersections: function(req, res) {
        log.info('In getAllIntersections');
        intersectionModel
        .find()
        .select('intersectionName location modeControl')
        .then(function(data) {
            if (data) {
                log.debug('Successful');
                return res
                .status(200)
                .json(data);
            }
            else {
                log.debug('Not found');
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function(error) {
            log.error('intersectionModel: ', error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        });
    },

    getIntersection: function(req, res) {
        log.info('In getIntersection');
        intersectionModel
        .findById(req.params.id)
        .select('intersectionName modeControl delta trafficLights')
        .populate({ path: 'trafficLights', 
        select: 'streetName bearing timeRed timeYellow timeGreen camip ' })
        .then(function(data) {
            if (data) {
                log.debug('Successful');
                return res
                .status(200)
                .json(data);
            }
            else {
                log.debug('Not found');
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function(error) {
            log.error('intersectionModel', error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        })
    },

    configTime: function(req, res) {
        log.info('In configTime');
        intersectionModel
        .findById(req.params.id)
        .select('delta trafficLights -_id')
        .then(function(data) {
            if (data) {
                intersectionModel
                .findByIdAndUpdate(req.params.id, { $set: { delta: req.body.delta }})
                .catch(function(error) {
                    log.error('intersectionModel ', error);
                    return res
                    .status(200)
                    .json({
                        status: 'error', 
                        message: 'Cập nhật thất bại!'
                    })
                })
                for (var i in data.trafficLights) {
                    trafficLightModel.findByIdAndUpdate(data.trafficLights[i], { $set: {
                        timeRed: req.body.timeReds[i],
                        timeYellow: req.body.timeYellows[i],
                        timeGreen: req.body.timeGreens[i]
                    }})
                    .catch(function(error) {
                        log.error('trafficLightModel', error);
                        return res
                        .status(200)
                        .json({
                            status: 'error', 
                            message: 'Cập nhật thất bại!'
                        })
                    })
                }
                log.debug('Successful');
                return res
                .status(200)
                .json({
                    status: 'success', 
                    message: 'Cập nhật thành công!'
                })
            }
            else {
                log.error('Not found intersection');
                return res
                .status(200)
                .json({
                    status: 'error', 
                    message: 'Cập nhật thất bại!'
                })
            }
        })
        .catch(function(error) {
            log.error('intersectionModel', error);
            return res
            .status(200)
            .json({
                status: 'error', 
                message: 'Cập nhật thất bại!'
            })
        })
    },

    matchIntersection: function(req, res) {
        log.info('In matchIntersection');
        log4js.getLogger('data-received').info(req.body);
        var PromiseAllArray = []
        function matchIntersectionPromise(location, bearing) {
            return new Promise(function(resolve, reject) {
                trafficLightModel
                .findOne()
                .where('location')
                .intersects()
                .geometry({ type: 'Point', coordinates: location })
                .where('bearing', bearing)
                .select('_id intersectionId location')
                .exec(function(err, data) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                })
            })
        }

        for (var data of req.body) {
            PromiseAllArray
            .push(matchIntersectionPromise(data.location, data.bearing))
        }

        Promise
        .all(PromiseAllArray)
        .then(function(preProcessData) {
            var idTrafficLight = []
            for (var data of preProcessData) {
                if (data != null) {
                    idTrafficLight.push(data);
                }
            }
            log4js.getLogger('data-send').info(idTrafficLight);
            log.debug('Successful')
            return res
            .status(200)
            .json(idTrafficLight)
        })
        .catch(function(error) {
            log.error('trafficLightModel: ', error);
            return res
            .status(501)
            .json({
                status: 'error',
                message: 'Lỗi'
            })
        })
    },

    getAllVehicles: function(req, res) {
        log.info('In getAllVehicles');
        vehicleModel
        .find()
        .select('license_plate status vehicleType')
        .then(function(data) {
            if (data) {
                log.debug('Success');
                return res
                .status(200)
                .json(data);
            }
            else {
                log.debug('Not found');
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function(error) {
            log.error('vehicleModel: ', error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        });
    },
}