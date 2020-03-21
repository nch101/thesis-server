var ids = require('shortid');
var intersectionModel = require('../models/intersection.model');

module.exports = {
    createIntersection: function(req, res) {
        var errors = [];
        if (!req.body.name) errors.push('Name is required!');
        if (!req.body.coordinates) errors.push('Coordinates is required!');
        if (!req.body.bearing) errors.push('Bearing is; required!');
        if (!req.body.trafficLight) errors.push('Traffic light is required');
        if (errors.length) {
           return res.render('', {
               errors: errors,
               values: req.body
           });
        };

        intersectionModel.findOne({name: req.body.name}).select('_id')
        .then(function(results) {
            if (results)
                return res.json({
                    message: 'Intersection available!'
                })
            var intersection = new intersectionModel(req.body);
            intersection._id = ids.generate();
            intersection.save()
            .then(function(data) {
                res.json(data);
            })
            .catch(function(error) {
                console.log(error);
                res.json({
                    message: 'Create intersection unsuccess! '
                })
            });
        })
        .catch(function(error) {
            console.log(error);
            res.json({
                message: 'Create intersection unsuccess! '
            })
        })
    },

    getAllIntersections: function(req, res) {
        intersectionModel.find().select('name coordinates controlStatus')
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            console.log(error);
            res.json({
                message: 'Cannot get all intersections'
            });
        });
    },

    getIntersection: function(req, res) {
        intersectionModel.findById(req.params.id)
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            console.log(error);
            res.json({
                message: 'Cannot get'
            });
        })
    },

    deleteIntersection: function(req, res) {
        if (!req.params.id) {
            return res.json({
                message: 'Id is not available! '
            });
        } else {
            intersectionModel.findByIdAndRemove(req.params.id).select('_id')
            .then(function(results) {
                if (results)
                    return res.json({
                        message: 'Intersection has been deleted!'
                    });
                return res.json({
                    message: 'Intersection does not exist!'
                })
            })
            .catch(function(error) {
                console.log(error);
                return res.json({
                    message: 'Id is not available! '
                });
            });
        }
    },

    editIntersection: function(req, res) {
        intersectionModel.findByIdAndUpdate(req.params.id, req.body)
        .then(function(data) {
            return res.json(data);
        })
        .catch(function(error) {
            return res.json({
                message: 'Cannot update intersection'
            });
        });
    }
}