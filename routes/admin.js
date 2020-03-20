var express = require('express');
var router = express.Router();
var adminControllers = require('../controllers/adminControllers');

router.post('/user/create-user', adminControllers.createUser);
router.put('/user/block-user/:id', adminControllers.blocked);
router.put('/user/unblock-user/:id', adminControllers.unBlocked);
router.delete('/user/delete-user/:id', adminControllers.deleteUser);

module.exports = router;