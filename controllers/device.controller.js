var bcrypt = require('bcryptjs');
var ids = require('shortid');
var deviceModel = require('../models/device.model');

module.exports = {
    createDevice: function(req, res) {
        /*         var error = [];
        if (!req.body.username) error.push('Username is required!');
        if (!req.body.password) error.push('Password is required!');
        if (!req.body.admin) error.push('Field admin is required!');
        if (error) {
           return res.render();
        }; */
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        var device = new deviceModel(req.body);

        device._id = ids.generate();
        device.save()
        .then(function(deviceData) {
            res.json(deviceData);
        })
        .catch(function(error) {
            console.log(error);
            res.json({
                message: 'Create device unsuccess !'
            })
        });
    },

    getAllDevices: function(req, res) {
        deviceModel.find().select('username license_plate status blocked')
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            console.log(error);
            res.json({
                message: 'Can not get all devices'
            });
        });
    },

    // getDevice: function(req, res) {
    //     deviceModel.findById(req.params.id).select('username license_plate email phone company -_id')
    //     .then(function(data) {
    //         res.json(data);
    //     })
    //     .catch(function(error) {
    //         console.log(error);
    //         res.json({
    //             message: 'Can not get user'
    //         });
    //     })
    // },

    blockedDevice: function(req, res) {
        if (!req.params.id) {
            return res.json({
                message: 'Id is not available! '
            });
        } else {
            deviceModel.findByIdAndUpdate(req.params.id, { $set: {blocked: true}}).select('_id')
            .then(function (results) {
                if (results)
                    return res.json({
                        message: 'Device has been blocked!'
                    });
                return res.json({
                    message: 'Device does not exist!'
                });
            })
            .catch(function (error) {
                console.log(error);
                return res.json({
                    message: 'Id is not available! '
                });
            })
        }
    },

    unlockedDevice: function(req, res) {
        if (!req.params.id) {
            return res.json({
                message: 'Id is not available! '
            });
        } else {
            deviceModel.findByIdAndUpdate(req.params.id, { $set: {blocked: false}}).select('_id')
            .then(function (results) {
                if (results)
                    return res.json({
                        message: 'Device has been unblocked!'
                    });
                return res.json({
                    message: 'Device does not exist!'
                });
            })
            .catch(function (error) {
                console.log(error);
                return res.json({
                    message: 'Id is not available! '
                });
            })
        }
    },

    deleteDevice: function(req, res) {
        var id = req.params.id;
        if (!id) {
            return res.json({
                message: 'Id is not available! '
            });
        } else {
            deviceModel.findByIdAndRemove(id).select('_id')
            .then(function(results) {
                if (results)
                    return res.json({
                        message: 'Device has been deleted!'
                    });
                return res.json({
                    message: 'Device does not exist!'
                })
            })
            .catch(function(error) {
                console.log(error);
                return res.json({
                    message: 'Id is not available! '
                });
            });
        }
    },
}