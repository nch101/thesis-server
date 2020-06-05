var bcrypt = require('bcryptjs');
var log4js = require('log4js');
var logger = log4js.getLogger('validates.vehicle');
var vehicleModel = require('../models/vehicle.model');
var tokenModel = require('../models/token.model');
var jwt = require('../helper/jwt');
var key = require('../helper/key');

module.exports = {
    vehicleValidate: function(req, res) {
        vehicleModel
        .findOne({ license_plate: req.body.license_plate })
        .select('license_plate password')
        .then(function(data) {
            if (bcrypt.compareSync(req.body.password, data.password)) {
                var vehicle = {
                    id: data._id,
                    name: data.license_plate
                };

                Promise
                .all([jwt.generateToken(vehicle, key.secretKey, key.tokenLife), 
                jwt.generateToken(vehicle, key.refreshSecretKey, key.refreshTokenLife)])
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
                    .redirect('/vehicle/direction');
                })
                .catch(function(error) {
                    logger.error('Generate token error, id: s%, error: %s', data._id, error);
                    return res
                    .status(501)
                    .render('error/index.pug', {
                        code: 501,
                        message: 'Not Implemented'
                    });
                });
            }
            else {
                logger.warn('Auth fail, vehicle: %s', req.body.license_plate);
                return res
                .status(200)
                .render('login/vehicle.pug', {
                    error: true,
                    values: req.body
                });
            }
        })
        .catch(function(error) {
            logger.error('Auth error, vehicle: %s, error: %s', req.body.vehicle, error);
            return res
            .status(200)
            .render('login/vehicle.pug', {
                error: true,
                values: req.body
            });
        })
    }
}