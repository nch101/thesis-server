var bcrypt = require('bcryptjs');
var db = require('../models/database');

module.exports = {
    login: function(req, res) {
        res.render('auth/login');
    },

    loginHandle: function(req, res) {
        var username = req.body.username;
        var password = req.body.password;

        var errors = [];
        if (!username) errors.push("Username is required!");
        if (!password) errors.push("Password is required!");
        if (errors.length) {
            res.render("auth/login", {
                errors: errors,
                values: req.body
            });
            return;
        };

        var checkUser = "SELECT Uid, Username, Password, Admin FROM Users WHERE Username = ?";
        db.query(checkUser, [username], function(err, results) {
            if (err)
                throw err;
            if (results.length === 0) {
                res.render("auth/login", {
                    errors: ["Username does not exist!"],
                    values: req.body
                });
                return;
            }
            else if ((results[0].Username === username) && bcrypt.compareSync(password, results[0].Password)) {                
                if (results[0].Admin) {
                    res.render("users/admin");
                }
                else {
                    res.render("users/device"); 
                };
            }
            else {
                res.render("auth/login", {
                    errors: ["Password is incorrect!"],
                    values: req.body
                });
                return;
            };
        });
    }
}