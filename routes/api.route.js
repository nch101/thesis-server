var express = require('express');
var router = express.Router();

var apiController = require('../controllers/api.controller');
var intersectionValidate = require('../validates/intersection.validate');

router.post('/intersection', intersectionValidate.nameExists, apiController.createIntersection);
router.get('/intersection/', apiController.getAllIntersections);
router.get('/intersection/:id', apiController.getIntersection);
router.put('/intersection/:id', apiController.configTime);

router.put('/vehicle/journey', apiController.matchIntersection);

router.put('/test', function(req, res) {
    console.log(req.body)
    return res
    .status(200)
    .json({ 
        status: 'success',
        message: 'Đã nhận!' })
})

module.exports = router;