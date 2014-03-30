'use strict';

// Dependencies
var express = require('express'),
  http = require('http'),
  path = require('path');

// Application dependencies
var app = express();

// All environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '/public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
} else {
  app.use(express.errorHandler());
}

// Routes
app.get('/', function(req, res) {
  res.render('application', {
    env: app.get('env')
  });
});

// Init server
http.createServer(app).listen(app.get('port'), function() {
  console.log('Server listening on port ' + app.get('port') + ' in ' + app.get('env') + ' mode');
});
