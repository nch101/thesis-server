module.exports = {

    /** Login page controller **/

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

    /** End of login page controller **/

    overviewPage: function(req, res) {
        return res
        .status(200)
        .render('users/overview');
    },

    /** Create page controller **/

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
    },

    /** End of create page controller **/

    /** Control page controller **/

    controlPage: function(req, res) {
        return res
        .status(200)
        .render('users/intersection.control.pug')
    },

    /** End of control page controller **/

    /** Direction page **/

    directionPage: function(req, res) {
        return res
        .status(200)
        .render('vehicle/direction.pug')
    },

    /** End of direction page **/
}