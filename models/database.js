var mysql = require('mysql');

var connect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});

var creDatabase = 'CREATE DATABASE IF NOT EXISTS demo';
var useDatabase = 'USE demo';

var creTableUsers = 'CREATE TABLE IF NOT EXISTS Users ' +
                        '(uId CHAR(8) NOT NULL, ' +
                        'Username VARCHAR(255) NOT NULL, ' +
                        'Password VARCHAR(255) NOT NULL, ' +
                        'Email VARCHAR(255), ' +
                        'Fullname VARCHAR(255) NOT NULL, ' +
                        'AvatarURL VARCHAR(255), ' +
                        'Phone VARCHAR(20), ' +
                        'Address VARCHAR(255), ' +
                        'Admin TINYINT(1) NOT NULL, ' +
                        'Banned TINYINT(1) NOT NULL DEFAULT 0, ' +
                        'PRIMARY KEY (uId))';

var creTableDevices = 'CREATE TABLE IF NOT EXISTS Devices ' +
                        '(dId CHAR(8) NOT NULL, ' +
                        'Username VARCHAR(255) NOT NULL, ' +
                        'Password VARCHAR(255) NOT NULL, ' +
                        'License_plate VARCHAR(10) NOT NULL, ' +
                        'Phone VARCHAR(20), ' +
                        'Company VARCHAR(255), ' +
                        'Address VARCHAR(255), ' +
                        'Status TINYINT(1) NOT NULL, ' +
                        'Dep_lat FLOAT(11,8), ' +
                        'Dep_lon FLOAT(11,8), ' +
                        'Des_lat FLOAT(11,8), ' +
                        'Des_lon FLOAT(11,8), ' +
                        'Current_lat FLOAT(11,8), ' +
                        'Current_lon FLOAT(11,8), ' +
                        'PRIMARY KEY (dId))';

var creTableIntersection = 'CREATE TABLE IF NOT EXISTS Intersection ' + 
                            '(iId CHAR(8) NOT NULL, ' + 
                            'Name VARCHAR(255) NOT NULL, ' +
                            'Lat FLOAT(11,8) NOT NULL, ' +
                            'Lon FLOAT(11,8) NOT NULL, ' +
                            'Bearing1 SMALLINT NOT NULL, ' + 
                            'Bearing2 SMALLINT NOT NULL, ' +
                            'Bearing3 SMALLINT NOT NULL, ' +
                            'Bearing4 SMALLINT NOT NULL, ' +
                            'PRIMARY KEY (iId))';

var creTableTrafficLight = 'CREATE TABLE IF NOT EXISTS TrafficLight ' +
                            '(tId CHAR(8) NOT NULL, ' +
                            'streetName VARCHAR(255) NOT NULL, ' +
                            'intersectionId CHAR(8) NOT NULL, ' +
                            'camIp VARCHAR(16), ' +
                            'Bearing SMALLINT NOT NULL, ' + 
                            'Light_status VARCHAR(5) NOT NULL, ' +
                            'Control_status VARCHAR(9) NOT NULL, ' +
                            'Time_red SMALLINT UNSIGNED NOT NULL, ' +
                            'Time_yellow SMALLINT UNSIGNED NOT NULL, ' +
                            'Time_green SMALLINT UNSIGNED NOT NULL, ' +
                            'PRIMARY KEY (tId), ' + 
                            'FOREIGN KEY (intersectionId) REFERENCES Intersection(iId))';

var queryDb = [creDatabase, useDatabase, creTableUsers, creTableDevices, 
    creTableIntersection, creTableTrafficLight];

var accessDbPromise = function(command) {
    return new Promise(function(resolve, reject) {
        connect.query(command, function(err, results) {
            if (err) 
                reject(err);
            else
                resolve(results);
        });
    });
}

Promise.all(
    queryDb.map(function(command) {
        return accessDbPromise(command);
    })
).then(function() {
    console.log('Connected to demo database! ');
}).catch(function(err) {
    console.log(err);
})

module.exports = {
    connect,
    accessDbPromise: accessDbPromise,
} 