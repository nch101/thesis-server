var jwt = require('jsonwebtoken');

module.exports = {
    generateToken: function(user, secretKey, tokenLife) {
        return new Promise (function(resolve, reject) {
            const userData = {
                uId: user.uId,
                name: user.Username,
                email: user.Email
            };
            jwt.sign({data: userData}, secretKey, { expiresIn:tokenLife }, function(err, token) {
                if (err)
                    reject(err);
                else 
                    resolve(token);
            });
        })
    },
    
    verifyToken: function(token, secretKey) {
        return new Promise (function(resolve, reject) {
            jwt.verify(token, secretKey, function(err, decode) {
                if (err)
                    reject(err);
                else 
                    resolve(decode);
            })
        })
    },
    
}
