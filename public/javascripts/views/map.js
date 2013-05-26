var MapView = Backbone.View.extend({
	id: 'map',
	initialize: function() {
		this.createMap();
	},
	createMap: function() {
		// var southWest = new L.LatLng(-76, 120),
		// 	northEast = new L.LatLng(76, -120),
		// 	bounds = new L.LatLngBounds(southWest, northEast);

		var map = new L.Map(this.id, { 
			center: [0.26, -27.37],
			zoom: 4,
			maxZoom: 7
			//maxBounds: bounds
		});

		var tiles = L.tileLayer('http://amethyst.gw2stuff.com/resources/images/map/worldmap/{z}_{x}_{y}.jpg');

		map.addLayer(tiles);

		this.map = map;
	},
	showEventLayer: function() {
		function createMarker(feature, latlng) {
			var iconSize;

			switch(feature.properties.status) {
				case 'Active':
					iconSize = new L.Point(30, 30);
				break;
				default:
					iconSize = new L.Point(10, 10);
				break;
			}

			var icon = L.divIcon({
				className: 'event-marker ' + feature.properties.status,
				iconSize: iconSize
			});

			var marker = L.marker(latlng, {
				icon: icon
			});

			return marker;
		}

		var features = _.map(app.events.toJSON(), function(m) {
			return {
				type: "Feature",
				properties: {
					name: m.name,
					chain: m.chain,
					position: m.position,
					map: m.map,
					status: m.status
				},
				geometry: $.parseJSON(m.geojson)
			};
		});

		var geoJSON = {
			type: "FeatureCollection",
			features: features
		};

		var eventLayer = L.geoJson(geoJSON, {
			pointToLayer: createMarker,
			style: function (feature) {
				//return {color: feature.properties.color};
			},
			onEachFeature: function (feature, layer) {
				//console.log(feature);
				layer.bindPopup(feature.properties.name);
			}
		});

		if (this.currentLayer) {
			this.map.removeLayer(this.currentLayer);
		}

		this.currentLayer = eventLayer;

		this.map.addLayer(eventLayer);
	}
});