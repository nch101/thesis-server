module.exports = {
    loginOption: function(req, res) {
        return res
        .status(200)
        .render('auth/main-login');
    },

    vehicleLogin: function(req, res) {
        return res
        .status(200)
        .render('auth/vehicle-login')
    },

    centerLogin: function(req, res) {
        return res
        .status(200)
        .render('auth/center-login');
    },

    overviewPage: function(req, res) {
        return res
        .status(200)
        .render('users/overview');
    },

    createVehiclePage: function(req, res) {
        return res
        .status(200)
        .render('users/vehicle.create.pug');
    },

    createCenterControlPage: function(req, res) {
        return res
        .status(200)
        .render('users/center.create.pug')
    },

    createIntersectionPage: function(req, res) {
        return res
        .status(200)
        .render('users/intersection.create.pug')
    }
}