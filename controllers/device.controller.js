var bcrypt = require('bcryptjs');
var deviceModel = require('../models/device.model');

module.exports = {
    createDevice: function(req, res) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        var device = new deviceModel(req.body);
        device.save()
        .then(function(data) {
            return res
            .status(301)
            .json(data);
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(501)
            .json({
                message: 'Create device unsuccess !'
            })
        });
    },

    editDevice: function(req, res) {

    },

    getAllDevices: function(req, res) {
        deviceModel
        .find()
        .select('username license_plate status blocked')
        .then(function(data) {
            return res
            .status(301)
            .json(data);
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(501)
            .json({
                message: 'Cannot get'
            });
        });
    },

    getDevice: function(req, res) {
        deviceModel
        .findById(req.params.id)
        .select('username license_plate email phone company -_id')
        .then(function(data) {
            return res
            .status(301)
            .json(data);
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(501)
            .json({
                message: 'Can not get user'
            });
        })
    },

    blockedDevice: function(req, res) {
        deviceModel
        .findByIdAndUpdate(req.params.id, { $set: {blocked: true}})
        .select('_id')
        .then(function (results) {
            if (results)
                return res
                .status(301)
                .json({
                    message: 'Device has been blocked!'
            });
            return res
            .status(503)
            .json({
                message: 'Device does not exist!'
            });
        })
        .catch(function (error) {
            console.log(error);
            return res
            .status(501)
            .json({
                message: 'Id is not available! '
            });
        })
    },

    unBlockedDevice: function(req, res) {
        deviceModel
        .findByIdAndUpdate(req.params.id, { $set: {blocked: false}})
        .select('_id')
        .then(function (results) {
            if (results)
                return res
                .status(301)
                .json({
                    message: 'Device has been unblocked!'
            });
            return res
            .status(503)
            .json({
                message: 'Device does not exist!'
            });
        })
        .catch(function (error) {
            console.log(error);
            return res
            .status(501)
            .json({
                message: 'Id is not available! '
            });
        })
    },

    deleteDevice: function(req, res) {
        deviceModel
        .findByIdAndRemove(req.params.id)
        .select('_id')
        .then(function(results) {
            if (results)
                return res
                .status(301)
                .json({
                    message: 'Device has been deleted!'
                });
            return res
            .status(503)
            .json({
                message: 'Device does not exist!'
            })
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(501)
            .json({
                message: 'Id is not available! '
            });
        });
    },

    getLocation: function(req, res) {
        deviceModel
        .findById(req.params.id)
        .select('journey -_id')
        .then(function(data) {
            return res
            .status(301)
            .json(data)
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(501)
            .json({
                message: 'Cannot get'
            });
        })
    },

    updateLocation: function(req,res) {
        deviceModel
        .findByIdAndUpdate(req.params.id, { $set: {}})
        .select('_id')
        .then(function (data) {
            if (data)
                return res
                .status(301)
                .json(data);
            return res
            .status(503)
            .json({
                message: 'Device does not exist!'
            });
        })
        .catch(function (error) {
            console.log(error);
            return res
            .status(501)
            .json({
                message: 'Cannot update location'
            });
        })
    },
}