var bcrypt = require('bcryptjs');
var ids = require('shortid');
var userModel = require('../models/user.model');

module.exports = {
    //For admin user
    createUser: function(req, res){
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        var user = new userModel(req.body);
        user._id = ids.generate();
        user.save()
        .then(function(results) {
            return res
            .status(200)
            .json(results);
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(501)
            .json({ message: 'Create user unsuccess !' })
        });
    },

    getAllUsers: function(req, res) {
        userModel
        .find()
        .select('firstname lastname username admin blocked ')
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

    blockedUser: function(req, res) {
        userModel
        .findByIdAndUpdate(req.params.id, { $set: { blocked: true } })
        .select('_id')
        .then(function (data) {
            if (data) {
                return res
                .status(200)
                .json({ message: 'Blocked!' });
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
        });
    },

    unlockedUser: function(req, res) {
        userModel
        .findByIdAndUpdate(req.params.id, { $set: { blocked: false }}).select('_id')
        .then(function (data) {
            if (data) {
                return res
                .status(200)
                .json({ message: 'Unblocked!' });
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

    deleteUser: function(req, res) {
        userModel
        .findByIdAndRemove(req.params.id)
        .select('_id')
        .then(function(data) {
            if (data) {
                return res
                .status(200)
                .json({ message: 'Deleted!' });
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

    //For standard user
    
    getUser: function(req, res) {
        userModel
        .findById(req.params.id)
        .select('firstname lastname email phone')
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

    editUser: function(req, res) {
        userModel
        .findByIdAndUpdate(req.params.id, { $set: {
            email: req.body.email,
            fullname: req.body.fullname,
            phone: req.body.phone,
            address: req.body.address,
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
        userModel
        .findById(req.params.id)
        .select('password')
        .then(function(data) {
            if (data) {
                if (bcrypt.compareSync(req.body.oldPassword, data.password)) {
                    userModel
                    .findByIdAndUpdate(req.params.id, { $set: {
                        password: bcrypt.hashSync(req.body.newPassword, 10)
                    }})
                    .then(function(results) {
                        return res
                        .status(301)
                        .json({ message: 'Password change successful!' })
                    })
                    .catch(function(error) {
                        console.log(error)
                        return res
                        .status(501)
                        .json({ message: 'Password change unsuccessful!' })
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
}