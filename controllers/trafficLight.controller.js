var intersectionModel = require('../models/intersection.model');

module.exports = {
    getTrafficLight: function(req, res) {
        intersectionModel.find({'trafficLight._id': req.params.id})
        .then(function(data) {
            res.json(data)
        })
        .catch((error) => {
            res.json('Cannot get')
        })
    },

}