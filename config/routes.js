//Load controllers
var controllers = require("../app/controllers/");

exports.routes = function(app) {

	//Get homepage
	app.get("/", function(req, res){
		controllers.home(req, res);
	});
	
	//Get Word vs World map
	app.get("/wvw", function(req, res){
		controllers.map(req, res);
	});
	
	//Get Build builder
	app.get("/wvw", function(req, res){
		controllers.build(req, res);
	});
	
};