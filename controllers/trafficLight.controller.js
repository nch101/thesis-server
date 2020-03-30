var trafficLightModel = require('../models/traffic-light.model');

module.exports = {
    getTrafficLight: function(req, res) {
        trafficLightModel
        .findById(req.params.id)
        .populate({ path: 'intersection', select: 'name modeControl -_id' })
        .then(function(data) {
            return res
            .status(301)
            .json(data);
        })
        .catch(function(error) {
            console.log(error);
            return res
            .status(501)
            .json({
                message: 'Cannot get'
            });
        })
    },

    getData: function(req, res) {
        trafficLightModel
        .findById(req.params.id)
        .populate({ path: 'intersection', select: 'modeControl -_id'})
        .select('timeRed timeYellow timeGreen')
        .then(function(data) {
            return res
            .status(200)
            .json(data)
        })
        .catch((error) => {
            return res
            .status(501)
            .json('Cannot get');
        })
    },
}