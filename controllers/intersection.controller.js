var mongoose = require('mongoose');
var intersectionModel = require('../models/intersection.model');
var trafficLightModel = require('../models/traffic-light.model');
var log4js = require('log4js');
var logger = log4js.getLogger('controllers.intersection');

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
                logger.error('Create traffic lights error: %s', error);
                return res
                .status(200)
                .json({
                    status: 'error', 
                    message: 'Khởi tạo thất bại!'
                });
            });
        }
        intersection.save()
        .then(function(results) {
            logger.info('Create intersection successful, id: %s', results._id);
            return res
            .status(200)
            .json({
                status: 'success', 
                message: 'Khởi tạo thành công!'
            });
        })
        .catch(function(error) {
            logger.error('Create intersection error: %s', error);
            return res
            .status(200)
            .json({
                status: 'error', 
                message: 'Khởi tạo thất bại!'
            });
        });
    },

    //Be not used yet
    deleteIntersection: function(req, res) {
        intersectionModel
        .findByIdAndRemove(req.params.id)
        .select('trafficLights -_id')
        .then(function(data) {
            if (data) {
                for (let index = 0; index < data.get('trafficLights').length; index++) {
                    trafficLightModel
                    .findByIdAndRemove(data.get('trafficLights')[index])
                    .catch(function (error) {
                        logger.error('Deleted traffic light error: %s', error);
                        return res
                        .status(501)
                        .json(error)
                    })
                };
                logger.info('Deleted intersection successful, id: %s', req.params.id);               
                return res
                .status(301)
                .json({ message: 'Deleted!' });

            }
            else {
                logger.info('Intersection not found to delete, id: %s', req.params.id);
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function(error) {
            logger.error('Deleted intersection id: %s , error: %s', req.params.id, error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        });
    },

    //Be not used yet
    editIntersection: function(req, res) {
        intersectionModel
        .findByIdAndUpdate(req.params.id, { $set: {
            intersectionName: req.body.intersectionName,
            location: req.body.locations,
            modeControl: req.body.modeControl
        }})
        .then(function(data) {
            if (data) {
                for (let index = 0; index < data.get('trafficLights').length; index++) {
                    trafficLightModel
                    .findByIdAndUpdate(data.get('trafficLights')[index], {
                        $set: req.body.trafficLights[index]
                    })
                    .catch(function (error) {
                        return res
                        .status(501)
                        .json(error)
                    })
                };
                return res
                .status(301)
                .json({ message: 'Updated successful!' })
            }
            else {
                return res
                .status(404)
                .json({ message: 'Not found!' })
            }
        })
        .catch(function(error) {
            return res
            .status(501)
            .json({ message: 'Error!' });
        });
    },

    configTime: function(req, res) {
        intersectionModel
        .findById(req.params.id)
        .select('delta trafficLights -_id')
        .then(function(data) {
            if (data) {
                intersectionModel
                .findByIdAndUpdate(req.params.id, { $set: { delta: req.body.delta }})
                .catch(function(error) {
                    logger.error('Updated delta time in intersection: %s, error: %s', req.params.id, error);
                    return res
                    .status(200)
                    .json({
                        status: 'error', 
                        message: 'Cập nhật thất bại!'
                    });
                })
                for (var i in data.trafficLights) {
                    trafficLightModel.findByIdAndUpdate(data.trafficLights[i], { $set: {
                        timeRed: req.body.timeReds[i],
                        timeYellow: req.body.timeYellows[i],
                        timeGreen: req.body.timeGreens[i]
                    }})
                    .catch(function(error) {
                        logger.error('Update time for traffic lights error: %s', error);
                        return res
                        .status(200)
                        .json({
                            status: 'error', 
                            message: 'Cập nhật thất bại!'
                        });
                    });
                }
                logger.info('Update time for intersection: %s successful', req.params.id);
                return res
                .status(200)
                .json({
                    status: 'success', 
                    message: 'Cập nhật thành công!'
                })
            }
            else {
                logger.info('Intersection not found to update time, id: %s', req.params.id);
                return res
                .status(200)
                .json({
                    status: 'error', 
                    message: 'Dữ liệu về giao lộ không có trong database !'
                })
            }
        })
        .catch(function(error) {
            logger.error('Update time for intersection: %s , error: %s', req.params.id, error);
            return res
            .status(200)
            .json({
                status: 'error', 
                message: 'Cập nhật thất bại!'
            })
        })
    },

    getAllIntersections: function(req, res) {
        intersectionModel
        .find()
        .select('intersectionName location modeControl')
        .then(function(data) {
            if (data) {
                logger.info('Response all intersections data');
                return res
                .status(200)
                .json(data);
            }
            else {
                logger.info('Not found intersections data');
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function(error) {
            logger.error('Get all intersections data error: %s', error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        });
    },

    getIntersection: function(req, res) {
        intersectionModel
        .findById(req.params.id)
        .select('intersectionName modeControl delta trafficLights')
        .populate({ path: 'trafficLights', 
        select: 'streetName priority timeRed timeYellow timeGreen camip ' })
        .then(function(data) {
            if (data) {
                logger.info('Get data intersection id: %s', req.params.id);
                return res
                .status(200)
                .json(data);
            }
            else {
                logger.info('Intersection id: %s not found to get', req.params.id);
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function(error) {
            logger.error('Get intersection id: %s , error: %s', req.params.id, error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        })
    },

    matchIntersection: function(req, res) {
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
            logger4js.getLogger('data-send').info(idTrafficLight);
            logger.info('Matching intersection success');
            return res
            .status(200)
            .json(idTrafficLight)
        })
        .catch(function(error) {
            logger.error('Matching intersection error: %s', error);
            return res
            .status(501)
            .json({
                status: 'error',
                message: 'Lỗi'
            })
        })
    },

}