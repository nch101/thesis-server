var ids = require('shortid');
var intersectionModel = require('../models/intersection.model');

module.exports = {
    createIntersection: function(req, res) {
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

    getAll: function(req, res) {
        deviceModel.find().select('username license_plate status blocked ')
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            console.log(error);
            res.json({
                message: 'Can not get all devices'
            });
        });
    },

    // getDevice: function(req, res) {
    //     deviceModel.findById(req.params.id).select('username license_plate email phone company -_id')
    //     .then(function(data) {
    //         res.json(data);
    //     })
    //     .catch(function(error) {
    //         console.log(error);
    //         res.json({
    //             message: 'Can not get user'
    //         });
    //     })
    // },

    blockedDevice: function(req, res) {
        if (!req.params.id) {
            return res.json({
                message: 'Id is not available! '
            });
        } else {
            deviceModel.findByIdAndUpdate(req.params.id, { $set: {blocked: true}}).select('_id')
            .then(function (results) {
                if (results)
                    return res.json({
                        message: 'Device has been blocked!'
                    });
                return res.json({
                    message: 'Device does not exist!'
                });
            })
            .catch(function (error) {
                console.log(error);
                return res.json({
                    message: 'Id is not available! '
                });
            })
        }
    },

    unlockedDevice: function(req, res) {
        if (!req.params.id) {
            return res.json({
                message: 'Id is not available! '
            });
        } else {
            deviceModel.findByIdAndUpdate(req.params.id, { $set: {blocked: false}}).select('_id')
            .then(function (results) {
                if (results)
                    return res.json({
                        message: 'Device has been unblocked!'
                    });
                return res.json({
                    message: 'Device does not exist!'
                });
            })
            .catch(function (error) {
                console.log(error);
                return res.json({
                    message: 'Id is not available! '
                });
            })
        }
    },

    deleteDevice: function(req, res) {
        var id = req.params.id;
        if (!id) {
            return res.json({
                message: 'Id is not available! '
            });
        } else {
            deviceModel.findByIdAndRemove(id).select('_id')
            .then(function(results) {
                if (results)
                    return res.json({
                        message: 'Device has been deleted!'
                    });
                return res.json({
                    message: 'Device does not exist!'
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

}