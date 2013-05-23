var NameModel = Backbone.Model.extend();

var NamesCollection = Backbone.Collection.extend({
	model: EventModel,
	url: 'https://api.guildwars2.com/v1/event_names.json?lang=es'
});