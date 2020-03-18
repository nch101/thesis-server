var bcrypt = require('bcryptjs');
var jwtHelper = require('../helpers/jwt');
var db = require('../models/database');

const tokenLife = process.env.TOKEN_LIFE_USER || '1h';
const secretKey = process.env.SECRET_KEY_USER || 'huy';


module.exports = {
    loginPage: function(req, res) {
        res.render('/');
    },

    loginHandle: async function(req, res) {
        var username = req.body.username;
        var password = req.body.password;

        var errors = [];
        if (!username) errors.push('Username is required!');
        if (!password) errors.push('Password is required!');
        if (errors.length) {
            res.render('auth/login', {
                errors: errors,
                values: req.body
            });
            return;
        };

        var checkUser = 'SELECT uId, Username, Password, Admin FROM Users WHERE Username = ?';
        var results = await db.accessDbPromise(checkUser, [username])
        
        try {
            if ((results[0].Username === username) && bcrypt.compareSync(password, results[0].Password)) {
                console.log(results[0]);
                const accessToken = await jwtHelper.generateToken(results[0], secretKey, tokenLife);
                return res.json({
                    status: 'success',
                    message: 'Da tao accessToken',
                    accessToken: accessToken
                });
            }
        } catch (error) {
            console.log(error);
            return res.json({
                status: 'error',
                message: 'Username hoac password khong dung'
            });
        }
    }
}