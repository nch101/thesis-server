var bcrypt = require('bcryptjs');
var ids = require('shortid');
var userModel = require('../models/user.model');

module.exports = {
    createUser: function(req, res){
/*         var error = [];
        if (!req.body.username) error.push('Username is required!');
        if (!req.body.password) error.push('Password is required!');
        if (!req.body.admin) error.push('Field admin is required!');
        if (error) {
           return res.render();
        }; */
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        var user = new userModel(req.body);

        user._id = ids.generate();
        user.save()
        .then(function(user) {
            res.json(user);
        })
        .catch(function(error) {
            console.log(error);
            res.json({
                message: 'Create user unsuccess !'
            })
        });
    },

    getAllUsers: function(req, res) {
        userModel.find().select('username fullname admin blocked ')
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            console.log(error);
            res.json({
                message: 'Can not get all users'
            });
        });
    },

    getUser: function(req, res) {
        userModel.findById(req.params.id).select('username fullname email phone company ')
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            console.log(error);
            res.json({
                message: 'Can not get user'
            });
        })
    },

    blockedUser: function(req, res) {
        if (!req.params.id) {
            return res.json({
                message: 'Id is not available! '
            });
        } else {
            userModel.findByIdAndUpdate(req.params.id, { $set: {blocked: true}}).select('_id')
            .then(function (results) {
                if (results)
                    return res.json({
                        message: 'User has been blocked!'
                    });
                return res.json({
                    message: 'User does not exist!'
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

    unlockedUser: function(req, res) {
        if (!req.params.id) {
            return res.json({
                message: 'Id is not available! '
            });
        } else {
            userModel.findByIdAndUpdate(req.params.id, { $set: {blocked: false}}).select('_id')
            .then(function (results) {
                if (results)
                    return res.json({
                        message: 'User has been unblocked!'
                    });
                return res.json({
                    message: 'User does not exist!'
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

    deleteUser: function(req, res) {
        var id = req.params.id;
        if (!id) {
            return res.json({
                message: 'Id is not available! '
            });
        } else {
            userModel.findByIdAndRemove(id).select('_id')
            .then(function(results) {
                if (results)
                    return res.json({
                        message: 'User has been deleted!'
                    });
                return res.json({
                    message: 'User does not exist!'
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