var EventModel = Backbone.Model.extend();

var EventsCollection = Backbone.Collection.extend({
	model: EventModel,
	url: 'https://api.guildwars2.com/v1/events.json?world_id=2301',
	parse: function(data) {
		var events = data.events,
			result = [],
			prepareEvents = [],
			activeEvents =  [];

		prepareEvents = _.where(events, { state: 'Preparation' });
		activeEvents = _.where(events, { state: 'Active' });

		result = _.union(prepareEvents, activeEvents);

		result = _.map(result, function(m) {
			m.name = app.names.get(m.event_id).get('name');
			m.map = app.maps.get(m.map_id).get('name');
			return m;
		});

		return result;
	},
	getEvents: function(callback) {
		var self = this;

		function onMapsSucess(mapsCollection) {
			app.names.fetch({
				success: onNamesSucess
			});
		}

		function onNamesSucess(namesCollection) {
			self.fetch({
				success: function(collection) {
					if (callback && typeof callback === 'function') {
						callback(collection);
					}
				}
			});
		}

		app.maps.fetch({
			success: onMapsSucess
		});
	}
});