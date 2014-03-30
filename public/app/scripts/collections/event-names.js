'use strict';

define([
  'backbone',
  '../models/event-name'
], function(Backbone, EventNameModel) {

  var EventNamesCollection = Backbone.Collection.extend({

    model: EventNameModel,

    url: 'https://api.guildwars2.com/v1/event_names.json?lang=es'

  });

  return EventNamesCollection;

});
