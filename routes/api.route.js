var express = require('express');
var router = express.Router();

var apiController = require('../controllers/api.controller');

router.get('/intersection/', apiController.getAllIntersections);
router.get('/intersection/:id', apiController.getIntersection);
router.put('/intersection/:id', apiController.configTime);

router.put('/test', function(req, res) {
    console.log(req.body)
    return res
    .status(200)
    .json({ 
        status: 'error',
        message: 'Cập nhật thất bại!' })
})

module.exports = router;