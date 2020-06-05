var log4js = require('log4js');
var logger = log4js.getLogger('middleware.user');
var jwt = require('../helper/jwt');
var key = require('../helper/key');

module.exports = {
    userMiddleware: async function(req, res, next) {
        if (req.cookies.token) {
            try {
                await jwt.verifyToken(req.cookies.token, key.secretKey);
                next();
            }
            catch(error) {
                logger.warn('Invalid token, error: %s', error);
                return res
                .status(304)
                .redirect('/center-control/login');
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