#Vars
lang = "en"

#CartoDB
cartodbMap = ->
	southWest = new L.LatLng -0.033179, -0.000004
	northEast = new L.LatLng 0.000004, 0.0477410
	bounds = new L.LatLngBounds southWest, northEast
	
	tiles = new L.TileLayer "/images/wvw/{z}/{x}/{y}.jpg", 
		minZoom: 16
		maxZoom: 18
	
	map = new L.Map "wvwMap",
		center: bounds.getCenter()
		zoom: 16
		minZoom: 16
		maxZoom: 18
		maxBounds: bounds
	
	popup = new L.CartoDBPopup()
	
	wvw = new L.CartoDBLayer(
		map: map
		user_name: "darkit"
		table_name: "wvw"
		query: "SELECT cartodb_id, name_" + lang + ", type, descrip_" + lang + ", score, ST_Transform(ST_Buffer(the_geom,0.001), 3857) as the_geom_webmercator FROM {{table_name}}"
		interactivity: "name_" + lang + ", type, descrip_" + lang + ", score"
		featureOver: (ev, latlng, pos, data) ->
			document.body.style.cursor = "pointer"
		
		featureOut: ->
			document.body.style.cursor = "default"
		
		featureClick: (ev, latlng, pos, data) ->
			infowindow = undefined
			ev.stopPropagation()
			infowindow = "<table>"
			infowindow += "<p><strong>" + data["name_" + lang] + "</strong></p>"  if data["name_" + lang]
			infowindow += "<p class=\"score\">" + data.score + "</p>"  if data.score
			infowindow += "<p class=\"descrip\">" + data["descrip_" + lang] + "</p>"  if data["descrip_" + lang]
			infowindow += "</table>"
			popup.setContent infowindow
			popup.setLatLng latlng
			map.openPopup popup
		
		auto_bound: false
		debug: false
	)
	
	map.addLayer tiles, true
	map.addLayer wvw, true


# DOM Ready
window.onload = ->
	cartodbMap()