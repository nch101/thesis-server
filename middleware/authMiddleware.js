var jwtHelper = require('../helpers/jwt');

const secretKey = process.env.SECRET_KEY_USER;

module.exports = {
    isAuth: async function(req, res, next){
        var accessToken = req.body.token || req.query.token || req.headers["x-access-token"];
        
        if (accessToken) {
            try {
                const decode = await jwtHelper.verifyToken(accessToken, secretKey);
                console.log(decode);
                req.locals.decode = decode;
                next();
            } catch(error) {
                return res.json({
                    status: 'error',
                    message: 'Access token khong hop le',
                })
            }
        }
        else {
            return res.json({
                status: 'error',
                message: 'Khong ton tai access token',
            })
        }
    },
}