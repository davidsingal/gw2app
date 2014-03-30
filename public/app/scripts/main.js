'use strict';

require.config({

  paths: {
    jquery: '../vendor/jquery/dist/jquery',
    underscore: '../vendor/underscore/underscore',
    backbone: '../vendor/backbone/backbone',
    leaflet: '../vendor/leaflet-dist/leaflet'
  },

  shim: {
    jquery: {
      exports: '$'
    },
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    leaflet: {
      exports: 'L'
    }
  }

});

require([
  'collections/event-names',
  'collections/map-names',
  'collections/world-names',
  'collections/high-events',
  'collections/events',
  'views/world',
  'views/map'
], function(EventNames, MapNames, WorldNames, HighEvents, Events, WorldSelector, MapView) {

  var BARUCH_BAY = 2301;

  sessionStorage.setItem('currentWorld', BARUCH_BAY);

  new WorldSelector();
  new MapView();

});
