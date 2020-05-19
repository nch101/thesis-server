var intersectionModel = require('../models/intersection.model');
var trafficLightModel = require('../models/traffic-light.model');
var vehicleModel = require('../models/vehicle.model');
var userModel = require('../models/user.model');

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
        console.log(req.body)
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
                console.log(error)
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
            return res
            .status(200)
            .json({
                status: 'success', 
                message: 'Khởi tạo thành công!'
            })
        })
        .catch(function(error) {
            console.log(error)
            return res
            .status(200)
            .json({
                status: 'error', 
                message: 'Khởi tạo thất bại!'
            })
        })
    },

    getAllIntersections: function(req, res) {
        intersectionModel
        .find()
        .select('intersectionName location modeControl')
        .then(function(data) {
            if (data) {
                return res
                .status(200)
                .json(data);
            }
            else {
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function(error) {
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
        select: 'streetName bearing timeRed timeYellow timeGreen camip ' })
        .then(function(data) {
            if (data) {
                return res
                .status(200)
                .json(data);
            }
            else {
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function(error) {
            return res
            .status(501)
            .json({ message: 'Error!' });
        })
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
                        return res
                        .status(200)
                        .json({
                            status: 'error', 
                            message: 'Cập nhật thất bại!'
                        })
                    })
                }
                return res
                .status(200)
                .json({
                    status: 'success', 
                    message: 'Cập nhật thành công!'
                })
            }
            else {
                return res
                .status(200)
                .json({
                    status: 'error', 
                    message: 'Cập nhật thất bại!'
                })
            }
        })
        .catch(function(error) {
            return res
            .status(200)
            .json({
                status: 'error', 
                message: 'Cập nhật thất bại!'
            })
        })
    },

    matchIntersection: function(req, res) {
        var PromiseAllArray = []
        function matchIntersectionPromise(location, bearing) {
            return new Promise(function(resolve, reject) {
                trafficLightModel
                .findOne()
                .where('location')
                .intersects()
                .geometry({ type: 'Point', coordinates: location })
                .where('bearing', bearing)
                .select('_id location')
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
            var idIntersection = []
            for (var data of preProcessData) {
                if (data != null) {
                    idIntersection.push(data);
                }
            }
            return res
            .status(200)
            .json(idIntersection)
        })
        .catch(function(error) {
            return res
            .status(501)
            .json(error)
        })
    }
}