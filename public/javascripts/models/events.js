var Event = Backbone.Model.extend();

var Events = Backbone.Collection.extend({
	model: Event,
	url: 'https://api.guildwars2.com/v1/events.json',
	parse: function(data) {
		var models = data.events,
			result = {},
			hight = app.highEvents;

		models = _.filter(models, function(model) {
			if (hight.get(model.event_id)) {
				return model;
			}
		});

		result = _.map(models, function(m) {
			return {
				position: app.highEvents.get(m.event_id).get('position'),
				chain: app.highEvents.get(m.event_id).get('event_chain'),
				name: app.eventNames.get(m.event_id).get('name'),
				map: app.mapNames.get(m.map_id).get('name'),
				geojson: app.highEvents.get(m.event_id).get('the_geom'),
				status: m.state
			};
		});

		return result;
	},
	getData: function(world, callback) {
		function onMapNames(collection) {
			app.eventNames.fetch({
				success: onEventNames
			});
		}

		function onEventNames(collection) {
			app.highEvents.fetch({
				success: onHighEvents
			});
		}

		function onHighEvents(collection) {
			app.events.fetch({
				data: { world_id: world },
				success: callback
			});
		}

		app.mapNames.fetch({
			success: onMapNames
		});
	},
	updateDate: function(world, callback) {
		app.events.fetch({
			data: { world_id: world },
			success: callback
		});
	}
});