var bcrypt = require('bcryptjs');
var userModel = require('../models/user.model');

module.exports = {
    validateUser: function(req, res) {
        userModel
        .findOne({ username: req.body.username })
        .select('password')
        .then(function(data) {
            if (bcrypt.compareSync(req.body.password, data.password)) {
                return res
                .status(304)
                .render('users/admin');
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
            .status(501)
            .json({ message: 'Error!' });
        })
    }
}