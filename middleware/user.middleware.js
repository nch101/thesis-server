var log4js = require('log4js');
var logger = log4js.getLogger('middleware.user');
var jwt = require('../helper/jwt');
var key = require('../helper/key');
var refreshToken = require('../middleware/refreshAccessToken');

module.exports = {
    userMiddleware: async function(req, res, next) {
        if (req.cookies.accessToken) {
            try {
                await jwt.verifyToken(req.cookies.accessToken, key.secretKey);
                logger.info('Verify token success');
                next();
            }
            catch(error) {
                if (error.name === 'TokenExpiredError') {
                    logger.info('refresh accessToken');
                    refreshToken.refreshAccessToken(req, res, next);
                }
                else {
                    logger.error('Invalid token, error: %s', error);
                    return res
                    .status(304)
                    .redirect('/center-control/login');
                }
            }
        }
        else {
            logger.warn('No token provided');
            return res
            .status(304)
            .redirect('/center-control/login');
        }
    }
}