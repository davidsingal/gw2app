var WorldName = Backbone.Model.extend();

var WorldNames = Backbone.Collection.extend({
	model: WorldName,
	url: 'https://api.guildwars2.com/v1/world_names.json?lang=es'
});