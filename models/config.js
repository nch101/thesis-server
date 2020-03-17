var db = require('./database');
var getSecretKey = 'SELECT Name, Parameter FROM Parameter WHERE Name = "SecretKey"';

module.exports = {
    SecretKey: db.accessDbPromise(getSecretKey)
}
