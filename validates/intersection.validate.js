var intersectionModel = require('../models/intersection.model');

module.exports = {
    nameExists: function (req, res, next) {
        intersectionModel
        .findOne({name: req.body.name})
        .select('_id')
        .then(function(results) {
            if (results) {
                return res
                .status(400)
                .json({ message: 'Intersection already exists' });
            }
            else 
                next()
        })
        .catch(function(error) {
            return res
            .status(501)
            .json({ message: 'Error!' })
        })
    },
}