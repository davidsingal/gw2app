#Vars
win = $(window)


#Functions
cartoDB =
	init: ->
		@.size()
		
	size: ->
		$("div#map").css "height", win.height() - 32
		
	launch: ->
		southWest = new L.LatLng -0.033179, -0.000004
		northEast = new L.LatLng 0.000004, 0.0477410
		
		bounds = new L.LatLngBounds southWest, northEast
		
		tiles = new L.TileLayer "/images/maps/wvw/{z}/{x}/{y}.jpg",
			minZoom: 16
			maxZoom: 18
		
		map = new L.Map "map",
			center: bounds.getCenter()
			zoom: 16
			minZoom: 16
			maxZoom: 18
			maxBounds: bounds
		
		map.addLayer tiles, true
		
		popup = new L.CartoDBPopup()
		
		wvw = new L.CartoDBLayer
			map: map
			user_name: "darkit"
			table_name: "wvw"
			#query: "SELECT * FROM {{table_name}}"
			query: "SELECT cartodb_id, ST_Transform(ST_Buffer(the_geom,0.001), 3857) as the_geom_webmercator FROM {{table_name}}"
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
	canvas: document.getElementById "canvas"
		
	init: ->
		@.size()
		@.showCanvas()
		@.draw()
		
	size: ->
		canvas = @.canvas
		canvas.width = win.width()
		canvas.height = win.height() - 32
		
	showCanvas: ->
		canvas = @.canvas
		$("a#drawButton").click (e)->
			e.preventDefault()
			self = @
			$(canvas).stop().fadeToggle ->
				$(self).toggleClass "active"
	
	draw: ->
		canvas = @.canvas
		canvas = document.getElementById "canvas"
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight - 32
		context = canvas.getContext "2d"
		context.scale 1, 1
		context.strokeStyle = "#000000"
		context.lineWidth = 3
		context.strokeRect 0, 0, canvas.width, canvas.height
		lastX = 0
		lastY = 0
		
		$(canvas).mousemove (e)->
			if (lastX == 0)
				lastX = e.pageX - canvas.offsetLeft
			if (lastY == 0)
				lastY = e.pageY - canvas.offsetTop
				
			context.beginPath()
			context.moveTo lastX, lastY
			
			lastX = e.pageX - canvas.offsetLeft
			lastY = e.pageY - canvas.offsetTop
			
			context.lineTo lastX, lastY
			context.fillRect lastX, lastY, 2, 2
			context.closePath()
			context.stroke()


#Document Ready
$ ->
	cartoDB.init()

#Window Load
win.load ->
	cartoDB.launch()
	drawCanvas.size()
	drawCanvas.init()

	
#Window Resize
win.resize ->
	cartoDB.size()