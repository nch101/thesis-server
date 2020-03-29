module.exports = {
    intersectionCreate = function (req, res, next) {
        var errors = [];
        if (!req.body.name) 
            errors.push('Name is required!');
        if (!req.body.coordinates) 
            errors.push('Coordinates is required!');
        if (!req.body.bearing) 
            errors.push('Bearing is; required!');
        if (!req.body.trafficLights) 
            errors.push('Traffic lights is required!');
        if (errors.length) {
            return res.render('', {
                errors: errors,
                values: req.body
            });
        }
        
        next();
    }
}