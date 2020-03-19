var bcrypt = require('bcryptjs');
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

        if (await userModel.exists({Username: username})) {
            return res.json({
                message: 'Username has exist! '
            });
        }
        else {
            var hashPassword = bcrypt.hashSync(password, 10);
            var dataUser = {
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
                .catch(function(err) {
                    console.log(err);
                })
        }
    }
}