var bcrypt = require('bcryptjs');
var userModel = require('../models/user.model');
var deviceModel = require('../models/device.model');

module.exports = {
    userValidate: function(req, res) {
        userModel
        .findOne({ username: req.body.username })
        .select('password')
        .then(function(data) {
            if (bcrypt.compareSync(req.body.password, data.password)) {
                return res
                .status(304)
                .redirect('/overview');
            }
            else {
                return res
                .status(200)
                .render('auth/center-login', {
                    error: true,
                    values: req.body
                });
            }
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(200)
            .render('auth/center-login', {
                error: true,
                values: req.body
            });
        })
    },

    vehicleValidate: function(req, res) {
        deviceModel
        .findOne({ license_plate: req.body.license_plate })
        .select('password')
        .then(function(data) {
            if (bcrypt.compareSync(req.body.password, data.password)) {
                return res
                .status(304)
                .redirect('/overview');
            }
            else {
                return res
                .status(200)
                .render('auth/vehicle-login', {
                    error: true,
                    values: req.body
                });
            }
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(200)
            .render('auth/vehicle-login', {
                error: true,
                values: req.body
            });
        })
    }
}