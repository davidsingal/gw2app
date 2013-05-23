var MapModel = Backbone.Model.extend();

var MapsCollection = Backbone.Collection.extend({
	model: EventModel,
	url: 'https://api.guildwars2.com/v1/map_names.json?lang=es'
});