var db = require('./database');

var checkUser = "SELECT Uid, Username, Password, Admin FROM Users WHERE Username = ?";
var debugCheckUser = async function(checkUser) {
    var results = await db.accessDbPromise(checkUser, ['huy'])
    console.log(results[0].Password);
}

debugCheckUser(checkUser);
