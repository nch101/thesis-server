var intersectionModel = require('../models/intersection.model');

module.exports = {
    nameExists: function (req, res, next) {
        intersectionModel
        .findOne({ intersectionName: req.body.intersectionName })
        .select('_id')
        .then(function(results) {
            if (results) {
                return res
                .status(400)
                .render('users/intersection.create.pug', {
                    error: true,
                    message: 'Tên giao lộ đã tồn tại! '
                })
            }
            else 
                next()
        })
        .catch(function(error) {
            console.log(error)
            return res
            .status(501)
            .render('users/intersection.create.pug', {
                error: true,
                message: 'Khởi tạo thất bại! '
            })
        })
    },
}