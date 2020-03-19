var express = require('express');
var router = express.Router();
var createUser = require('../controllers/usersController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/', createUser.createUser);

module.exports = router;
