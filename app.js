//Load Dependencies
var express = require("express"),
	lingua = require("lingua"),
	routes = require("./config/routes").routes;


//Create App
var app = express();


//App Configuration
app.configure(function() {
	app.set("views", __dirname + "/app/views");
	app.set("view engine", "jade");
	app.use(lingua(app, {
        defaultLocale: 'en',
        path: __dirname + '/translations'
    }));
    app.use(app.router);
	app.use(express.static(__dirname + "/public"));
});


//Load routes
routes(app);


//Init App
return app.listen(3000);