var mongoose = require('mongoose');
var intersectionModel = require('../models/intersection.model');
var trafficLightModel = require('../models/traffic-light.model');

module.exports = {
    createIntersection: function(req, res) {
        intersectionModel
        .findOne({name: req.body.name})
        .select('_id')
        .then(function(results) {
            if (results)
                return res
                .status(400)
                .json({ message: 'Intersection already exists' });

            var Intersection = new intersectionModel({
                _id: mongoose.Types.ObjectId(),
                name: req.body.name,
                coordinates: req.body.coordinates,
                bearing: req.body.bearing,
                controlStatus: req.body.controlStatus,
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
                .status(301)
                .json(results)
            })
            .catch(function(error) {
                return res
                .status(501)
                .json(error)
            })
        })
        .catch(function(error) {
            return res
            .status(501)
            .json(error)
        })
    },

    getAllIntersections: function(req, res) {
        intersectionModel
        .find()
        .select('name coordinates controlStatus')
        .then(function(data) {
            return res
            .status(301)
            .json(data);
        })
        .catch(function(error) {
            return res
            .status(501)
            .json({ message: 'Cannot get all intersections' });
        });
    },

    getIntersection: function(req, res) {
        intersectionModel
        .findById(req.params.id)
        .populate({path: 'trafficLights', 
        select: 'streetName timeRed timeYellow timeGreen camip bearing'})
        .then(function(data) {
            return res
            .status(301)
            .json(data)
        })
        .catch(function(error) {
            return res
            .status(501)
            .json({ message: 'Cannot get' })
        })
    },

    deleteIntersection: function(req, res) {
        if (!req.params.id)
            return res
            .status(401)
            .json({ message: 'Id is not available!' });
        else {
            intersectionModel
            .findById(req.params.id)
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
                    intersectionModel
                    .findByIdAndRemove(req.params.id)
                    .then(function() {
                        return res
                        .status(301)
                        .json({ message: 'Deleted!' });
                    })
                }
                else {
                    return res
                    .status(401)
                    .json({ message: 'Intersection does not exist!' })
                }
            })
            .catch(function(error) {
                console.log(error);
                return res
                .status(501)
                .json({ message: 'Cannot delete!' });
            });
        }
    },

    editIntersection: function(req, res) {
        intersectionModel
        .findByIdAndUpdate(req.params.id, { $set: {
            name: req.body.name,
            coordinates: req.body.coordinates,
            bearing: req.body.bearing,
            controlStatus: req.body.controlStatus
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
                .json({ message: 'Updated successful!'})
            }
            else {
                return res
                .status(401)
                .json({ message: 'Intersection does not exist!' })
            }
        })
        .catch(function(error) {
            return res
            .status(501)
            .json({ message: 'Cannot update intersection' });
        });
    }
}