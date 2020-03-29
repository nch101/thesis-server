module.exports = {
    idHas: function(req, res, next) {
        if (!req.params.id) {
            return res
            .status(401)
            .json({ message: 'Id is not available!' });
        }
        
        next();
    }
}