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
            console.log(error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        });
    },

    blockedDevice: function(req, res) {
        deviceModel
        .findByIdAndUpdate(req.params.id, { $set: {blocked: true}})
        .select('_id')
        .then(function(data) {
            if (data) {
                return res
                .status(200)
                .json({ message: 'Blocked!' });
            }
            else {
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function (error) {
            console.log(error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        })
    },

    unBlockedDevice: function(req, res) {
        deviceModel
        .findByIdAndUpdate(req.params.id, { $set: {blocked: false}})
        .select('_id')
        .then(function(data) {
            if (data) {
                return res
                .status(200)
                .json({ message: 'Unblocked!' });
            }
            else {
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function (error) {
            console.log(error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        })
    },

    deleteDevice: function(req, res) {
        deviceModel
        .findByIdAndRemove(req.params.id)
        .select('_id')
        .then(function(data) {
            if (data) {
                return res
                .status(200)
                .json({ message: 'Deleted!' });
            }
            else {
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        });
    },

    //For standard user

    getDevice: function(req, res) {
        deviceModel
        .findById(req.params.id)
        .select('-password')
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
            console.log(error);
            return res
            .status(501)
            .json({ message: 'Error!' });
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
        .then(function(data) {
            if (data) {
                return res
                .status(200)
                .json({ message: 'Edited!' });
            }
            else {
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        })
    },

    changePassword: function(req, res) {
        deviceModel
        .findById(req.params.id)
        .select('password')
        .then(function(data) {
            if (data) {
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
            }
            else {
                return res
                .status(404)
                .json({ message: 'Not found!' })
            }
        })
        .catch(function(error) {
            console.log(error)
            return res
            .status(501)
            .json({ message: 'Error!' })
        })
    },

    getLocation: function(req, res) {
        deviceModel
        .findById(req.params.id)
        .select('license_plate journey -_id')
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
            console.log(error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        })
    },

    updateLocation: function(req,res) {
        deviceModel
        .findByIdAndUpdate(req.params.id, { $set: {
            journey: req.body.journey
        }})
        .select('_id')
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
        .catch(function (error) {
            console.log(error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        })
    },
}