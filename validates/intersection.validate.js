var intersectionModel = require('../models/intersection.model');

module.exports = {
    checkField: function (req, res, next) {
        var errors = [];
        if (!req.body.name) 
            errors.push('Name is required!');
        if (!req.body.coordinates) 
            errors.push('Coordinates is required!');
        if (!req.body.bearing) 
            errors.push('Bearing is required!');
        if (!req.body.trafficLights) 
            errors.push('Traffic lights is required!');
        if (errors.length) {
            /* return res.render('', {
                errors: errors,
                values: req.body
            }); */
            return res
            .status(401)
            .json(errors)
        }
        next();
    },

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
            .json(error)
        })
    },

}