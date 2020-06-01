var express = require('express');
var router = express.Router();
var userControllers = require('../controllers/user.controller');

router.post('/', userControllers.createUser);
router.get('/:id', userControllers.getUser);
router.put('/:id', userControllers.editUser);
router.put('/change-password/:id', userControllers.changePassword);

module.exports = router;