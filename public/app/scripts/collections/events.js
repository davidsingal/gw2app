'use strict';

define([
  'underscore',
  'backbone',
  '../models/event',
  'collections/event-names',
  'collections/high-events',
  'collections/map-names'
], function(_, Backbone, EventModel, EventNames, HighEvents, MapNames) {

  var EventsCollection = Backbone.Collection.extend({

    model: EventModel,

    url: 'https://api.guildwars2.com/v1/events.json',

    parse: function(data) {
      var models = data.events,
        result = {},
        hight = this.highEvents,
        self = this;

      models = _.filter(models, function(model) {
        if (hight.get(model.event_id)) {
          return model;
        }
      });

      result = _.map(models, function(m) {
        return {
          position: self.highEvents.get(m.event_id).get('position'),
          chain: self.highEvents.get(m.event_id).get('event_chain'),
          name: self.eventNames.get(m.event_id).get('name'),
          map: self.mapNames.get(m.map_id).get('name'),
          geojson: self.highEvents.get(m.event_id).get('the_geom'),
          status: m.state
        };
      });

      return result;
    },

    initialize: function() {
      this.eventNames = new EventNames();
      this.highEvents = new HighEvents();
      this.mapNames = new MapNames();
    },

    getData: function(world, callback) {
      var self = this;

      function onMapNames() {
        self.eventNames.fetch({
          success: onEventNames
        });
      }

      function onEventNames() {
        self.highEvents.fetch({
          success: onHighEvents
        });
      }

      function onHighEvents() {
        self.fetch({
          data: {
            world_id: world
          },
          success: callback
        });
      }

      this.mapNames.fetch({
        success: onMapNames
      });
    },

    updateDate: function(world, callback) {
      this.fetch({
        data: {
          world_id: world
        },
        success: callback
      });
    }

  });

  return EventsCollection;

});
