'use strict';

define([
  'backbone',
  '../models/world-name'
], function(Backbone, WorldNameModel) {

  var WorldNamesCollection = Backbone.Collection.extend({

    model: WorldNameModel,

    url: 'https://api.guildwars2.com/v1/world_names.json?lang=es'

  });

  return WorldNamesCollection;

});
