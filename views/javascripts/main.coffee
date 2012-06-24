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
		
		tiles = new L.TileLayer "/images/maps/wvw/16/{x}/{y}.jpg",
			minZoom: 16
			maxZoom: 19
		
		map = new L.Map "map",
			center: bounds.getCenter()
			zoom: 16
			minZoom: 16
			maxZoom: 19
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
			#console.log bounds.getCenter()

drawCanvas =
	init: ->
		@.size()
	size: ->
		$("canvas#canvas").css "height", win.height() - 32


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