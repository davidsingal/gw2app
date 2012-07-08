#Vars
win = $(window)
map = null

#Functions
cartoDB =
	init: ->
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
			query: "SELECT cartodb_id, name, type, descrip, score, ST_Transform(ST_Buffer(the_geom,0.001), 3857) as the_geom_webmercator FROM {{table_name}}"
			interactivity: "name, type, descrip, score"
			
			featureOver: (ev, latlng, pos, data)->
				document.body.style.cursor = "pointer"
			
			featureOut: ->
				document.body.style.cursor = "default"
			
			featureClick: (ev, latlng, pos, data)->
				ev.stopPropagation()
				
				infowindow = "<table>"
				if (data.name)
					infowindow += "<p><strong>" + data.name + "</strong></p>"
				if (data.score)
					infowindow += "<p class=\"score\">" + data.score + " puntos</p>"
				if (data.descrip)
					infowindow += "<p class=\"descrip\">" + data.descrip + "</p>"
				infowindow += "</table>"
				
				popup.setContent infowindow
				popup.setLatLng latlng
				map.openPopup popup
			
			auto_bound: false
			debug: true
		
		map.addLayer wvw

drawCanvas =
	canvas: document.getElementById "canvas"
		
	init: ->
		@.size()
		@.showCanvas()
		@.draw()
		
	size: ->
		canvas = @.canvas
		canvas.width = win.width()
		canvas.height = win.height()
		
	showCanvas: ->
		canvas = @.canvas
		$("button#drawButton").click (e)->
			e.preventDefault()
			self = @
			$(canvas).stop().fadeToggle ->
				$(self).toggleClass "active"
	
	draw: ->
		canvas = @.canvas
		canvas = document.getElementById "canvas"
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight
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

siegeTools = 
	init: ->
		siege = null
		icon = null
				
		$("button#toolsButton").click (e)->
			e.preventDefault()
			self = @
			$("div#tools").stop().fadeToggle ->
				$(self).toggleClass "active"
				$("button.icon").click siegeTools.clickEvent
	
	clickEvent: ->
		self = $(@)
		colour = self.data "colour"
		dist = self.data "dist"
		id = self.attr "id"
		
		switch id
			when "trebuchet"
				iconOptions =
					iconUrl: "/images/assets/trebuchet-icon.png"
					iconSize: new L.Point 30, 26 
			when "catapult"
				iconOptions =
					iconUrl: "/images/assets/catapult-icon.png"
					iconSize: new L.Point 30, 27
			when "ram"
				iconOptions =
					iconUrl: "/images/assets/ram-icon.png"
					iconSize: new L.Point 30, 27
			when "arrow"
				iconOptions =
					iconUrl: "/images/assets/arrow-icon.png"
					iconSize: new L.Point 30, 27
			when "ballista"
				iconOptions =
					iconUrl: "/images/assets/ballista-icon.png"
					iconSize: new L.Point 30, 27
			else
				iconOptions = {}
		
		trebuchetIcon = L.Icon.extend iconOptions
			
		icon = new trebuchetIcon()
		
		marker = new L.Marker map.getCenter(), 
			draggable: true
			icon: icon
			
		circle = new L.Circle marker.getLatLng(), dist, 
			color: colour
			weight: 3
			
		circleMove = ->
			circle.setLatLng marker.getLatLng()
			
		marker.on "drag", circleMove
		marker.on "dblclick", ->
			map.removeLayer marker
			map.removeLayer circle
		
		map.addLayer marker
		map.addLayer circle

#Window Load
win.load ->
	cartoDB.init()
	drawCanvas.size()
	drawCanvas.init()
	siegeTools.init()

	
#Window Resize
win.resize ->
	drawCanvas.size()