var bcrypt = require('bcryptjs');
var log4js = require('log4js');
var logger = log4js.getLogger('validates.user');
var userModel = require('../models/user.model');
var tokenModel = require('../models/token.model');
var jwt = require('../helper/jwt');
var key = require('../helper/key');

module.exports = {
    userValidate: function(req, res) {
        userModel
        .findOne({ username: req.body.username })
        .select('firstname password admin')
        .then(function(data) {
            if (bcrypt.compareSync(req.body.password, data.password)) {
                var user = {
                    id: data._id,
                    name: data.firstname,
                    admin: data.admin
                };

                Promise
                .all([jwt.generateToken(user, key.secretKey, key.tokenLife), 
                jwt.generateToken(user, key.refreshSecretKey, key.refreshTokenLife)])
                .then(function(token) {
                    logger.info('Auth success, id: %s', data._id);
                    tokenModel.create({
                        token: [0],
                        refreshToken: token[1],
                    });

                    return res
                    .status(304)
                    .cookie('token', token[0])
                    .cookie('refreshToken', token[1])
                    .redirect('/center/overview');
                })
                .catch(function(error) {
                    logger.error('Generate token error, id: s%, error: %s', data._id, error);
                    return res
                    .status(501)
                    .render('error/index.pug', {
                        code: 501,
                        message: 'Not Implemented'
                    });
                })
            }
            else {
                logger.warn('Auth fail, username: %s', req.body.username);
                return res
                .status(200)
                .render('login/control-center.pug', {
                    error: true,
                    values: req.body
                });
            }
        })
        .catch(function(error) {
            logger.error('Auth error, username: %s, error: %s', req.body.username, error);
            return res
            .status(200)
            .render('login/control-center.pug', {
                error: true,
                values: req.body
            });
        })
    },

    refreshToken: function(req, res) {
        tokenModel
        .findOne({ refreshToken: req.cookie.refreshToken })
        .then(function(data) {
            
        })
    }
}