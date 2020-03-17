var bcrypt = require('bcryptjs');
var ids = require('shortid');
var db = require('../models/database');

module.exports = {
    listUsers: function(req, res) {
        res.render('users/listUser');
        return;
    },

    create: function(req, res) {
        var username = req.body.username;
        var password = req.body.password;
        var fullname = req.body.fullname;
        var company = req.body.company;
        var address = req.body.address;
        var phone = req.body.phone;
        var admin = req.body.admin;
        var service = req.body.service;
 
        var hashPassword = bcrypt.hashSync(password, 10);

        var checkUsername = "SELECT Username FROM Users WHERE Username = ?";
        var createUser = "INSERT INTO Users(Uid, Fullname, Username, Password, Company, Address, Phone, Admin, Service) VALUE (?, ?,?,?,?,?,?,?,?)"
 
        db.query(checkUsername, [username],function(err, results) {
            if (err)
                throw err;
            if (results.length != 0) {
                console.log("Username da ton tai");
                return res.json({
                    status: "error",
                    message: "Username da ton tai"
                }); 
            }
            else {
                var id = ids.generate();
                db.query(createUser, [id, fullname, username, hashPassword, company, address, phone, admin, service], function(err, results) {
                    if (err)
                        throw err;
                    console.log("User da duoc tao! ");
                    return res.json({
                        status: "success",
                        message: "User da duoc tao! "
                    });
                })
            };
                
        });
    },

    changePassword: function(req, res) {
        var id = parseInt(req.params.id);
        var oldPassword = req.body.oldPassword;
        var newPassword = req.body.newPassword;

        var checkPassword = "SELECT Id_u, Password FROM Users WHERE Id_u = ?";
        db.query(checkPassword, [id], function(err, results) {
            if (bcrypt.compareSync(oldPassword, results[0].Password)) {
                var hashPassword = bcrypt.hashSync(newPassword, 10);
                var changePassword = "UPDATE Users SET Password = ? WHERE Id_u = ?";
                db.query(changePassword, [hashPassword, id], function(err, results) {
                    if (err) 
                        throw err;
                    return res.json({
                        status: "success",
                        message: "Doi mat khau thanh cong! "
                    });
                })
            }
            else {
                return res.json({
                    status: "success",
                    message: "Sai mat khau cu! "
                });
            };
        });
    }    

}