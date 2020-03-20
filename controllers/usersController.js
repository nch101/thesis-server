var bcrypt = require('bcryptjs');
var ids = require('shortid');
var userModel = require('../models/user.model');

module.exports = {
    createUser: async function(req, res){
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
        var fullname = req.body.fullname;
        var phone = req.body.phone;
        var address = req.body.address;
        var admin = req.body.admin;
        var banned = req.body.banned;

        // var error = [];
        // if (!username) error.push('Username is required!');
        // if (!password) error.push('Password is required!');
        // if (!admin) error.push('Field admin is required!');
        // if (error) {
        //    return res.render();
        // };
        try {
            if (await userModel.exists({Username: username})) {
                return res.json({
                    message: 'Username has exist! '
                });
            }
            else {
                var hashPassword = bcrypt.hashSync(password, 10);
                var dataUser = {
                    _id: ids.generate(),
                    Username: username,
                    Password: hashPassword,
                    Fullname: fullname,
                    Email: email,
                    Phone: phone,
                    Address: address,
                    Admin: admin,
                    Banned: banned
                };
                userModel.create(dataUser)
                    .then(function() {
                        console.log('Tao user thanh cong');
                    })
            }
        } catch(error) {
            console.log(error);
        };
    },

    getProfile: function(req, res) {
        var id = req.locals.id;
        if (!id) {
            try {
                console.log(userModel.findById(id));
            } catch (error) {
                console.log(error);
            }
        }
    },

    banned: async function(req, res) {
        var id = req.params.id;
        console.log(id);
        if (!id) {
            return res.json({
                message: 'Id is not available! '
            });
        } else {
            try {
                var results = await userModel.findByIdAndUpdate(id, { $set: {Banned: true}}).select('_id');
                console.log(results);
                if (results){
                    return res.json({
                        message: 'User has already banned! '
                    });
                }
                else {
                    return res.json({
                        message: 'User does not exist!'
                    });
                }
            } catch (error) {
                console.log(error);
                return res.json({
                    message: 'Id is not available! '
                });
            }
        };
    },
}