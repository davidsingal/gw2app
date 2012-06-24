#Dependencies
express = require "express"
stylus = require "stylus"
coffee = require "coffee-script"
routes = require "./routes"

publicPath = __dirname + "/public"
viewsPath = __dirname + "/views"

app = module.exports = express.createServer()


#Configuration
app.configure ->
	app.set "views", viewsPath
	app.set "view engine", "jade"
	app.use express.bodyParser()
	app.use express.methodOverride()
	app.use app.router
	app.use stylus.middleware
		debug: true
		force: true
		src: viewsPath
		dest: publicPath
		compile: (str, path) ->
			stylus(str).set("filename", path).set("compress", true)
	app.use express.compiler
		src: viewsPath
		dest: publicPath
		enable: ['coffeescript']
	app.use express.static publicPath

app.configure "development", ->
	app.use express.errorHandler
		dumpExceptions: true
		showStack: true

app.configure "production", ->
	app.use express.errorHandler()
	

#Routes
app.get "/", routes.index
app.get "/wvw", routes.wvw

app.listen 3000, ->
	console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env