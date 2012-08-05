//Load controllers
var controllers = require("../app/controllers/");

exports.routes = function(app) {

	//Get homepage
	app.get("/", function(req, res){
		return controllers.home(req, res);
	});
	
	//Get Word vs World map
	app.get("/wvw", function(req, res){
		return controllers.map(req, res);
	});
	
	//Get Build builder
	app.get("/build", function(req, res){
		return controllers.build(req, res);
	});
	
};