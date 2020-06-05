var log4js = require('log4js');
var logger = log4js.getLogger('middleware.refreshAccessToken');
var jwtHelper = require('../helper/jwt');
var key = require('../helper/key');
var tokenModel = require('../models/token.model');

module.exports = {
    refreshAccessToken: function(req, res, next) {
        tokenModel
        .findOne({ refreshToken: req.cookie.refreshToken })
        .then(async function(data) {
            if(data) {
                try {
                    var decoded = await jwtHelper.verifyToken(req.cookie.refreshToken, key.refreshSecretKey);
                    var accessToken =  await jwtHelper.generateToken(decoded, key.secretKey, key.tokenLife);
    
                    logger.info('Refresh access token for user id: %s', user.id);
                    res
                    .status(200)
                    .cookie('token', accessToken);

                    next();
                }
                catch(error) {
                    logger.error('Refresh accessToken error: %s', error);
                    return res
                    .status(501)
                    .render('error/index.pug', {
                        code: 501,
                        message: 'Not Implemented'
                    })
                }
            }
            else {
                logger.warn('Invalid refresh token');
                return res
                .status(304)
                .redirect('/login')
            }
        })
        .catch(function(error) {
            logger.error('Refresh token error %s', error);
            return res
            .status(501)
            .render('error/index.pug', {
                code: 501,
                message: 'Not Implemented'
            })
        })
    }
}