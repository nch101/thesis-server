var bcrypt = require('bcryptjs');
var deviceModel = require('../models/device.model');

module.exports = {
    //For admin user
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
            .json(error)
        });
    },

    getAllDevices: function(req, res) {
        deviceModel
        .find()
        .select('license_plate status blocked')
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

    //For standard user

    getDevice: function(req, res) {
        deviceModel
        .findById(req.params.id)
        .select('-password')
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

    editDevice: function(req, res) {
        deviceModel
        .findByIdAndUpdate(req.params.id, { $set: {
            license_plate: req.body.license_plate,
            phone: req.body.phone,
            address: req.body.address,
            company: req.body.company
        }})
        .then(function() {
            return res
            .status(301)
            .json({ message: 'Update successful' });
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(501)
            .json({ message: 'Cannot update' });
        })
    },

    changePassword: function(req, res) {
        deviceModel
        .findById(req.params.id)
        .select('password')
        .then(function(data) {
            if (bcrypt.compareSync(req.body.oldPassword, data.password)) {
                deviceModel
                .findByIdAndUpdate(req.params.id, { $set: {
                    password: bcrypt.hashSync(req.body.newPassword, 10)
                }})
                .then(function(results) {
                    return res
                    .status(301)
                    .json({ message: 'Change password successed!' })
                })
                .catch(function(error) {
                    console.log(error)
                    return res
                    .status(501)
                    .json({ message: 'Change password unsuccessed!' })
                })
            }
            else {
                return res
                .status(400)
                .json({ message: 'Old password incorrect!' })
            }
        })
        .catch(function(error) {
            console.log(error)
            return res
            .status(501)
            .json({ message: 'Change password unsuccessed!' })
        })
    },

    getLocation: function(req, res) {
        deviceModel
        .findById(req.params.id)
        .select('license_plate journey -_id')
        .then(function(data) {
            return res
            .status(200)
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
        .findByIdAndUpdate(req.params.id, { $set: {
            journey: req.body.journey
        }})
        .select('_id')
        .then(function (data) {
            if (data)
                return res
                .status(200)
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