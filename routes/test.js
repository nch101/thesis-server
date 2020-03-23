var express = require('express');
var router = express.Router();
var server = require('../bin/www');
var io = require('socket.io')(server);

router.use('/', function(req, res) {
    res.render('test');
})

module.exports = router;