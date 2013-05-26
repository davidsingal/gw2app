var EventName = Backbone.Model.extend();

var EventNames = Backbone.Collection.extend({
	model: EventName,
	url: 'https://api.guildwars2.com/v1/event_names.json?lang=es'
});