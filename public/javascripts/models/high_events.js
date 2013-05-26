var HighEvent = Backbone.Model.extend();

var HighEvents = Backbone.Collection.extend({
	model: HighEvent,
	url: 'http://darkit.cartodb.com/api/v2/sql?q=SELECT%20event_id%20AS%20id,%20position,%20event_chain,%20st_asgeojson(the_geom,%204326)%20AS%20the_geom%20FROM%20tyria',
	parse: function(data) {
		return data.rows;
	}
});