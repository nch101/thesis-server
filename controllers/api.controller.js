var intersectionModel = require('../models/intersection.model');
var trafficLightModel = require('../models/traffic-light.model');
var deviceModel = require('../models/device.model');
var userModel = require('../models/user.model');

module.exports = {
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
                    .status(501)
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
                        .status(501)
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
                .status(404)
                .json({
                    status: 'error', 
                    message: 'Cập nhật thất bại!'
                })
            }
        })
        .catch(function(error) {
            return res
            .status(501)
            .json({
                status: 'error', 
                message: 'Cập nhật thất bại!'
            })
        })
    },
}