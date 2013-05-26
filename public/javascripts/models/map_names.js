var MapName = Backbone.Model.extend();

var MapNames = Backbone.Collection.extend({
	model: MapName,
	url: 'https://api.guildwars2.com/v1/map_names.json?lang=es'
});