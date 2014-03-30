'use strict';

define([
  'backbone',
  '../models/map-name'
], function(Backbone, MapNameModel) {

  var MapsNamesCollection = Backbone.Collection.extend({

    model: MapNameModel,

    url: 'https://api.guildwars2.com/v1/map_names.json?lang=es'

  });

  return MapsNamesCollection;

});
