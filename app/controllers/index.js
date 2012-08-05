exports.home = function(req, res) {
	return res.render("index", {
		title: res.lingua.content.welcome,
		description: res.lingua.content.homeDesc
	});
};

exports.map = function(req, res) {
	var options = {
		lang: res.lingua.locale
	};
	
	switch(req.route.path) {
		case "/wvw": 
			options.title = res.lingua.content.wvw;
			options.description = res.lingua.content.wvwDesc;
		break;
	}
	
	return res.render("map", options);
};

exports.build = function(req, res) {
	return res.render("build");
};