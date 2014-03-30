'use strict';

define([
  'backbone',
  '../models/high-event'
], function(Backbone, HighEventModel) {

  var HighEventsCollection = Backbone.Collection.extend({

    model: HighEventModel,

    url: 'http://darkit.cartodb.com/api/v2/sql?q=SELECT%20event_id%20AS%20id,%20position,%20event_chain,%20st_asgeojson(the_geom,%204326)%20AS%20the_geom%20FROM%20tyria',

    parse: function(data) {
      return data.rows;
    }

  });

  return HighEventsCollection;

});
