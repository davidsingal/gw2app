//Load Dependencies
var express = require("express"),
	http = require("http"),
	lingua = require("lingua"),
	routes = require("./config/routes").routes;


//Create App
var app = express();


//App Configuration
app.configure(function() {
	app.set("port", process.env.PORT || 3000);
	app.set("views", __dirname + "/app/views");
	app.set("view engine", "jade");
	app.use(lingua(app, {
        defaultLocale: "en",
        path: __dirname + "/translations"
    }));
    app.use(app.router);
	app.use(express.static(__dirname + "/public"));
});

app.configure("development", function(){
	app.use(express.errorHandler());
});


//Load routes
routes(app);


//Init App
return http.createServer(app).listen(app.get("port"), function(){
	console.log("Express server listening on port " + app.get("port"));
});