var mongoose = require('mongoose');
var intersectionModel = require('../models/intersection.model');
var trafficLightModel = require('../models/traffic-light.model');

module.exports = {
    createIntersection: function(req, res) {
        var Intersection = new intersectionModel({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            location: req.body.location,
            bearings: req.body.bearings,
            modeControl: req.body.modeControl,
        });
        for (let index = 0; index < req.body.trafficLights.length; index++) {
            var trafficLight = new trafficLightModel(req.body.trafficLights[index])
            Intersection.trafficLights.push(trafficLight._id);
            trafficLight.intersection = Intersection._id;
            trafficLight.save()
            .catch(function(error) {
                return res
                .status(501)
                .json(error)
            })
        }
        Intersection.save()
        .then(function(results) {
            return res
            .status(200)
            .json(results)
        })
        .catch(function(error) {
            return res
            .status(501)
            .json(error)
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
            name: req.body.name,
            location: req.body.location,
            bearings: req.body.bearings,
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
        .select('trafficLights')
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
        .select('name location modeControl')
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
        .populate({path: 'trafficLights', 
        select: 'streetName timeRed timeYellow timeGreen camip bearing'})
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