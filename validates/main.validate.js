var bcrypt = require('bcryptjs');
var userModel = require('../models/user.model');
var vehicleModel = require('../models/vehicle.model');

module.exports = {
    userValidate: function(req, res) {
        userModel
        .findOne({ username: req.body.username })
        .select('password')
        .then(function(data) {
            if (bcrypt.compareSync(req.body.password, data.password)) {
                return res
                .status(304)
                .redirect('/center/overview');
            }
            else {
                return res
                .status(200)
                .render('login/control-center.pug', {
                    error: true,
                    values: req.body
                });
            }
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(200)
            .render('login/control-center.pug', {
                error: true,
                values: req.body
            });
        })
    },

    vehicleValidate: function(req, res) {
        vehicleModel
        .findOne({ license_plate: req.body.license_plate })
        .select('password')
        .then(function(data) {
            if (bcrypt.compareSync(req.body.password, data.password)) {
                return res
                .status(304)
                .redirect('/vehicle/direction');
            }
            else {
                return res
                .status(200)
                .render('login/vehicle.pug', {
                    error: true,
                    values: req.body
                });
            }
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(200)
            .render('login/vehicle.pug', {
                error: true,
                values: req.body
            });
        })
    }
}