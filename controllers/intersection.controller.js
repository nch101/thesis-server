var mongoose = require('mongoose');
var intersectionModel = require('../models/intersection.model');
var trafficLightModel = require('../models/traffic-light.model');

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
            _id: mongoose.Types.ObjectId(),
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
                return res
                .status(501)
                .json(error)
            })
        }
        intersection.save()
        .then(function(results) {
            return res
            .status(200)
            .render('users/intersection.create.pug', {
                success: true,
                message: 'Khởi tạo thành công! '
            })
        })
        .catch(function(error) {
            return res
            .status(501)
            .render('users/intersection.create.pug', {
                error: true,
                message: 'Khởi tạo thất bại! '
            })
        })
    },

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
                        return res
                        .status(501)
                        .json(error)
                    })
                };
                return res
                .status(301)
                .json({ message: 'Deleted!' });

            }
            else {
                return res
                .status(404)
                .json({ message: 'Not found!' })
            }
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        });
    },

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
        .select('trafficLights -_id')
        .populate('trafficLights')
        .then(function(data) {
            if (data) {
                for (let index = 0; index < data.get('trafficLights').length; index++) {
                    trafficLightModel
                    .findByIdAndUpdate(data.get('trafficLights')[index], { $set: req.body.configTime[index] })
                    .catch(function(error) {
                        return res
                        .status(501)
                        .json(error)
                    })
                }
                return res
                .status(200)
                .json({ message: 'Updated successful!'})
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

    updateModeControl: function(req, res) {
        intersectionModel
        .findByIdAndUpdate(req.params.id, { $set: { 
            modeControl: req.body.modeControl 
        }})
        .then(function(data) {
            if (data) {
                return res
                .status(200)
                .json({ message: 'Updated!' });
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

    getData: function(req, res) {
        intersectionModel
        .findById(req.params.id)
        .select('trafficLights modeControl')
        .populate({ path: 'trafficLights', select: 'timeRed timeYellow timeGreen' })
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
    }
}