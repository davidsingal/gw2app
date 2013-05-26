var BARUCH_BAY = 2301;

var app = {};

function onDocumentReady() {
	app.timer = null;
	app.currentWorld = BARUCH_BAY;

	app.eventNames = new EventNames(); // API
	app.mapNames = new MapNames(); // API
	app.worldNames = new WorldNames(); // API
	app.highEvents = new HighEvents(); // CartoDB

	app.events = new Events(); // API

	app.world = new WorldSelector();
	app.map = new MapView();

	app.events.getData(app.currentWorld, function(collection) {
		app.map.showEventLayer();
		app.timer = setInterval(function() {
			app.events.updateDate(app.currentWorld, function(collection) {
				app.map.showEventLayer();
			});
		}, 5000);
	});
}

$(document).ready(onDocumentReady);