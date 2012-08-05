exports.home = function(req, res) {
	res.render("index");
};

exports.map = function(req, res) {
	res.render("map");
};

exports.build = function(req, res) {
	res.render("build");
};