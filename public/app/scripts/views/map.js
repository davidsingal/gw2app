'use strict';

define([
  'jquery',
  'underscore',
  'backbone',
  'leaflet',
  '../collections/events'
], function($, _, Backbone, L, EventsCollection) {

  var MapView = Backbone.View.extend({

    id: 'map',

    initialize: function() {
      var self = this;
      var currentWorld = sessionStorage.getItem('currentWorld');

      this.mapEvents = new EventsCollection();
      this.createMap();

      this.mapEvents.getData(currentWorld, function() {
        self.showEventLayer();
        self.update();
      });

      Backbone.Events.on('change:world', this.reset, this);
    },

    createMap: function() {
      var map = new L.Map(this.id, {
        center: [0.26, -27.37],
        zoom: 3,
        maxZoom: 7
      });

      var tiles = L.tileLayer('https://tiles.guildwars2.com/1/1/{z}/{x}/{y}.jpg');

      map.addLayer(tiles);

      this.map = map;
    },

    showEventLayer: function() {
      function createMarker(feature, latlng) {
        var iconSize;

        switch (feature.properties.status) {
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

      var features = _.map(this.mapEvents.toJSON(), function(m) {
        return {
          type: 'Feature',
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
        type: 'FeatureCollection',
        features: features
      };

      var eventLayer = L.geoJson(geoJSON, {
        pointToLayer: createMarker,
        onEachFeature: function(feature, layer) {
          if (feature.properties.status === 'Active') {
            layer.bindPopup(feature.properties.name);
          }
        }
      });

      if (this.currentLayer) {
        this.map.removeLayer(this.currentLayer);
      }

      this.currentLayer = eventLayer;

      this.map.addLayer(eventLayer);
    },

    update: function() {
      var self = this;
      var currentWorld = sessionStorage.getItem('currentWorld');

      this.timer = setInterval(function() {
        self.mapEvents.updateDate(currentWorld, function() {
          self.showEventLayer();
        });
      }, 10000);
    },

    reset: function() {
      clearInterval(this.timer);
      if (this.currentLayer) {
        this.map.removeLayer(this.currentLayer);
      }
      this.update();
    }

  });

  return MapView;

});
