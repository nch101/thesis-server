const mapToken = process.env.MAP_ACCESS_TOKEN;

module.exports = {
    accessToken: function(req, res) {
        return res.status(200).send(mapToken);
    }
}