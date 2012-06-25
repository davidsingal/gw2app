#Vars
win = $(window)


#Functions
cartoDB =
	init: ->
		@.size()
		
	size: ->
		$("div#map").css "height", win.height() - 32
		
	launch: ->
		southWest = new L.LatLng -0.033142, 0
		northEast = new L.LatLng 0, 0.047688
		
		bounds = new L.LatLngBounds southWest, northEast
		
		tiles = new L.TileLayer "/images/maps/wvw/{z}/{x}/{y}.jpg",
			minZoom: 16
			maxZoom: 20
		
		map = new L.Map "map",
			center: bounds.getCenter()
			zoom: 16
			minZoom: 16
			maxZoom: 20
			maxBounds: bounds
		
		map.addLayer tiles, true
		
		popup = new L.CartoDBPopup()
		
		wvw = new L.CartoDBLayer
			map: map
			user_name: "darkit"
			table_name: "wvw"
			query: "SELECT * FROM {{table_name}}"
			featureOver: (ev, latlng, pos, data) ->
				document.body.style.cursor = "pointer"
			
			featureOut: ->
				document.body.style.cursor = "default"
			
			featureClick: (ev, latlng, pos, data) ->
				ev.stopPropagation()
				popup.setContent data
				popup.setLatLng latlng
				map.openPopup popup
			
			auto_bound: false
			debug: true
			
		map.addLayer wvw
		
		#Events
		map.on "moveend", (e)->
			#console.log map.getBounds()

drawCanvas =
	vars:
		canvas: $("canvas#canvas")
		
	init: ->
		@.size()
		@.showCanvas()
		@.draw()
		
	size: ->
		@.vars.canvas.css "height", win.height() - 32
		
	showCanvas: ->
		$("a#drawButton").click (e)->
			e.preventDefault()
			self = @
			drawCanvas.vars.canvas.stop().fadeToggle ->
				$(self).toggleClass "active"
	
	draw: ->
		canvas = document.getElementById "canvas"
		context = canvas.getContext "2d"
		if context
			context.strokeStyle = "#000000"
			context.lineWidth = 3
			context.scale 1, 1
			context.strokeRect 0, 0, canvas.width, canvas.height
			context.stroke()


#Document Ready
$ ->
	cartoDB.init()
	drawCanvas.init()


#Window Load
win.load ->
	cartoDB.launch()
	drawCanvas.size()

	
#Window Resize
win.resize ->
	cartoDB.size()