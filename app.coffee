#Dependencies
express = require "express"
stylus = require "stylus"
coffee = require "coffee-script"
lingua = require "lingua"
io = require "socket.io"
routes = require("./routes")

publicPath = __dirname + "/public"
viewsPath = __dirname + "/views"
assetsPath = __dirname + "/assets"


#App
app = module.exports = express.createServer()

app.configure ->
	app.set "views", viewsPath
	app.set "view engine", "jade"
	app.set "view options",
		layout: false
	app.use lingua app,
		defaultLocale: "en"
		path: __dirname + "/translations"
	app.use express.bodyParser()
	app.use express.methodOverride()
	app.use app.router
	app.use stylus.middleware
		debug: true
		force: true
		src: assetsPath
		dest: publicPath
		compile: (str, path) ->
			stylus(str).set("filename", path).set "compress", true
	app.use express.compiler
		src: assetsPath
		dest: publicPath
		enable: ["coffeescript"]
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
app.get "/wvw/:channel", routes.channel


#Init
app.listen 3000, ->
	console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env


#Socket IO
server = io.listen app

server.sockets.on "connection", (socket)->
	socket.on "create", (channel)->
		console.log channel
	socket.on "message", (data)->
		console.log data