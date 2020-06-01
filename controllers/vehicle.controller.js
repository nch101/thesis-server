var bcrypt = require('bcryptjs');
var vehicleModel = require('../models/vehicle.model');
var log4js = require('log4js');
var logger = log4js.getLogger('controllers.vehicle');

module.exports = {
    createVehicle: function(req, res) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        var vehicle = new vehicleModel(req.body);
        vehicle.save()
        .then(function(data) {
            logger.info('Create vehicle id %s successful', data._id);
            return res
            .status(200)
            .render('control-center/create.vehicle.pug', {
                success: true,
                message: 'Tạo tài khoản thành công!'
            });
        })
        .catch(function(error) {
            logger.error('Create vehicle failed, error: %s', error);
            return res
            .status(501)
            .render('control-center/create.vehicle.pug', {
                error: true,
                values: req.body,
                message: 'Tạo tài khoản thất bại!'
            });
        });
    },

    //
    getAllVehicles: function(req, res) {
        vehicleModel
        .find()
        .select('license_plate status blocked')
        .then(function(data) {
            if (data) {
                return res
                .status(200)
                .json(data);
            }
            else {
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        });
    },

    trackingVehicle: function(req, res) {
        vehicleModel
        .find()
        .select('license_plate vehicleType phone status journey timeOn')
        .then(function(data) {
            // log4js.getLogger('data-send').debug('trackingVehicle: ', data);
            if (data) {
                logger.info('Render tracking vehicle page');
                return res
                .status(200)
                .render('control-center/tracking-vehicles.pug', {
                    nVehicle: data
                })
            }
            else {
                logger.warn('Vehicles not found to tracking');
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function(error) {
            logger.error('Render tracking vehicle error: %s', error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        });
    },

    blockedVehicle: function(req, res) {
        vehicleModel
        .findByIdAndUpdate(req.params.id, { $set: {blocked: true}})
        .select('_id')
        .then(function(data) {
            if (data) {
                logger.info('Blocked vehicle id: %s', req.params.id);
                return res
                .status(200)
                .json({
                    status: 'success', 
                    message: 'Đã block!' 
                });
            }
            else {
                logger.warn('Vehicle not found to block, id: %s', req.params.id);
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function (error) {
            logger.error('Blocked vehicle: %s , error: %s', req.params.id, error);
            return res
            .status(200)
            .json({
                status: 'error', 
                message: 'Đã xảy ra lỗi, không thể block!' 
            });
        })
    },

    unlockedVehicle: function(req, res) {
        vehicleModel
        .findByIdAndUpdate(req.params.id, { $set: {blocked: false}})
        .then(function(data) {
            if (data) {
                logger.info('Unlocked vehicle id: %s', req.params.id);
                return res
                .status(200)
                .json({
                    status: 'success', 
                    message: 'Đã mở block!' 
                });
            }
            else {
                logger.warn('Vehicle not found to unlock, id: %s', req.params.id);
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function (error) {
            logger.error('Unlocked user: %s , error: %s', req.params.id, error);
            return res
            .status(200)
            .json({
                status: 'error', 
                message: 'Đã xảy ra lỗi, không thể mở block!' 
            });
        })
    },

    deleteVehicle: function(req, res) {
        vehicleModel
        .findByIdAndRemove(req.params.id)
        .select('_id')
        .then(function(data) {
            if (data) {
                logger.info('Deleted vehicle id: %s', req.params.id);
                return res
                .status(200)
                .json({
                    status: 'success', 
                    message: 'Đã xóa!' 
                });
            }
            else {
                logger.warn('Vehicle not found to delete, id: %s', req.params.id);
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function(error) {
            logger.error('Deleted vehicle: %s , error: %s', req.params.id, error);
            return res
            .status(200)
            .json({
                status: 'error', 
                message: 'Xóa phương tiện thất bại!' 
            });
        });
    },

    //For standard user

    getVehicle: function(req, res) {
        vehicleModel
        .findById(req.params.id)
        .select('-password')
        .then(function(data) {
            if (data) {
                return res
                .status(200)
                .json(data);
            }
            else {
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        })
    },

    editVehicle: function(req, res) {
        vehicleModel
        .findByIdAndUpdate(req.params.id, { $set: {
            license_plate: req.body.license_plate,
            phone: req.body.phone,
            address: req.body.address,
            company: req.body.company
        }})
        .then(function(data) {
            if (data) {
                return res
                .status(200)
                .json({ message: 'Edited!' });
            }
            else {
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        })
    },

    changePassword: function(req, res) {
        vehicleModel
        .findById(req.params.id)
        .select('password')
        .then(function(data) {
            if (data) {
                if (bcrypt.compareSync(req.body.oldPassword, data.password)) {
                    vehicleModel
                    .findByIdAndUpdate(req.params.id, { $set: {
                        password: bcrypt.hashSync(req.body.newPassword, 10)
                    }})
                    .then(function(results) {
                        return res
                        .status(301)
                        .json({ message: 'Success!' })
                    })
                    .catch(function(error) {
                        console.log(error)
                        return res
                        .status(501)
                        .json({ message: 'Failed!' })
                    })
                }
                else {
                    return res
                    .status(400)
                    .json({ message: 'Old password incorrect!' })
                }
            }
            else {
                return res
                .status(404)
                .json({ message: 'Not found!' })
            }
        })
        .catch(function(error) {
            console.log(error)
            return res
            .status(501)
            .json({ message: 'Error!' })
        })
    },

    getLocation: function(req, res) {
        vehicleModel
        .findById(req.params.id)
        .select('license_plate journey -_id')
        .then(function(data) {
            if (data) {
                return res
                .status(200)
                .json(data);
            }
            else {
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        })
    },

    updateLocation: function(req,res) {
        vehicleModel
        .findByIdAndUpdate(req.params.id, { $set: {
            journey: req.body.journey
        }})
        .select('_id')
        .then(function(data) {
            if (data) {
                return res
                .status(200)
                .json({ message: 'Updated!' });
            }
            else {
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function (error) {
            console.log(error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        })
    },

    updateCurrentLocation: function(req,res) {
        console.log(req.body)
        vehicleModel
        .findOneAndUpdate(
            { '_id': req.params['vehicleID'], 'journey._id': req.params['locationID']},
            { 
                '$set': {
                    'journey.$.geometry.coordinates': req.body.coordinates
                }
            })
        .select('_id')
        .then(function(data) {
            if (data) {
                return res
                .status(200)
                .json({ message: 'Updated!' });
            }
            else {
                return res
                .status(404)
                .json({ message: 'Not found!' });
            }
        })
        .catch(function (error) {
            console.log(error);
            return res
            .status(501)
            .json({ message: 'Error!' });
        })
    },

    getAllCurrentLocation: function(req, res) {
        vehicleModel
        .find()
        .select('_id license_plate vehicleType journey')
        .then(function(data) {
            logger.info('Get location data of all vehicles')
            return res
            .status(200)
            .json(data)
        })
        .catch(function(error) {
            logger.error('Get location data of all vehicles error %s', error)
            return res
            .status(501)
            .json({ message: 'Error' });
        })
    }
}