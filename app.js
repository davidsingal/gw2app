// Dependencies
var express = require('express'),
	http = require('http'),
	path = require('path');

// Application dependencies
var app = express(),
	routes = require('./app/routes');

// All environments
app.configure(function() {
	app.set('port', process.env.VCAP_APP_PORT || 3000);
	app.set('views', __dirname + '/app/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

// development only
app.configure('development', function(){
	app.use(express.errorHandler());
});

// Routes
app.get('/', routes.homepage)
app.get('/eventos', routes.events);

// Init server
http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
