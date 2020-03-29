var trafficLightModel = require('../models/traffic-light.model');

module.exports = {
    getTrafficLight: function(req, res) {
        trafficLightModel.findById(req.params.id)
        .populate({path: 'intersection', select: 'name controlStatus -_id'})
        .then(function(data) {
            return res.status(301).json(data);
        })
        .catch(function(error) {
            console.log(error);
            res.status(501).json({
                message: 'Cannot get'
            });
        })
    },

    getData: function(req, res) {
        intersectionModel.find({'trafficLight._id': req.params.id})
        .select('trafficLight controlStatus -_id')
        .then(function(data) {
            return res.json(data)
        })
        .catch((error) => {
            return res.json('Cannot get');
        })
    }
}