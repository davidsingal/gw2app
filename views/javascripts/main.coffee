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
			query: "SELECT cartodb_id, nombre, tipo, descrip, ST_Transform(ST_Buffer(the_geom,0.001), 3857) as the_geom_webmercator FROM {{table_name}}"
			interactivity: "nombre, tipo, descrip"
			
			featureOver: (ev, latlng, pos, data)->
				document.body.style.cursor = "pointer"
			
			featureOut: ->
				document.body.style.cursor = "default"
			
			featureClick: (ev, latlng, pos, data)->
				ev.stopPropagation()
				
				infowindow = "<table>"
				if (data.nombre)
					infowindow += "<tr><th>Nombre:</th><td>" + data.nombre + "</td></tr>"
				if (data.puntuacion)
					infowindow += "<tr><th>Tipo:</th><td>" + data.puntuacion + "</td></tr>"
				if (data.descrip)
					infowindow += "<tr><th>Descripción:</th><td>" + data.descrip + "</td></tr>"
				infowindow += "</table>"
				
				popup.setContent infowindow
				popup.setLatLng latlng
				map.openPopup popup
			
			auto_bound: false
			debug: true
		
		map.addLayer wvw
		
		#Events
		#map.on "moveend", (e)->
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
		context.closePath()
		
		context.strokeStyle = "#ff0000"
		
		lastX = 0
		lastY = 0
		active = false
		
		$(canvas).mousedown (e)->
			e.preventDefault()
			paint(e)
			context.beginPath()
			context.moveTo lastX, lastY
			active = true
			
			$(canvas).mousemove (e)->
				if (active)
					paint(e)
					context.lineTo lastX, lastY
					context.stroke()
			
		$(canvas).mouseup (e)->
			e.preventDefault()
			if (active)
				paint(e)
				active = false
			
		paint = (e)->
			if (lastX == 0 or lastY == 0)
				lastX = e.pageX - canvas.offsetLeft
				lastY = e.pageY - canvas.offsetTop
			
			lastX = e.pageX - canvas.offsetLeft
			lastY = e.pageY - canvas.offsetTop
			

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