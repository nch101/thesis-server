var bcrypt = require('bcryptjs');
var vehicleModel = require('../models/vehicle.model');
var log4js = require('log4js');
var log = log4js.getLogger('vehicle-controller');

module.exports = {
    //For admin user
    createVehicle: function(req, res) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        var vehicle = new vehicleModel(req.body);
        vehicle.save()
        .then(function(data) {
            return res
            .status(200)
            .render('users/center.create.pug', {
                success: true,
                message: 'Tạo tài khoản thành công!'
            });
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(501)
            .render('users/center.create.pug', {
                error: true,
                message: 'Tạo tài khoản KHÔNG thành công!'
            });
        });
    },

    getAllVehicles: function(req, res) {
        vehicleModel
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

    trackingVehicle: function(req, res) {
        log.info('In trackingVehicle');
        vehicleModel
        .find()
        .select('license_plate vehicleType status journey timeOn')
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

    blockedVehicle: function(req, res) {
        vehicleModel
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

    unBlockedVehicle: function(req, res) {
        vehicleModel
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

    deleteVehicle: function(req, res) {
        vehicleModel
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

    getVehicle: function(req, res) {
        vehicleModel
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

    editVehicle: function(req, res) {
        vehicleModel
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
        vehicleModel
        .findById(req.params.id)
        .select('password')
        .then(function(data) {
            if (data) {
                if (bcrypt.compareSync(req.body.oldPassword, data.password)) {
                    vehicleModel
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
        vehicleModel
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
        vehicleModel
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