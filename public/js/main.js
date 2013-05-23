var BARUCH_BAY = 2301;
var rocaDelAugurio = 2103;
var dz = 2207;

var app = {};

function onDocumentReady() {
	app.names = new NamesCollection();
	app.maps = new MapsCollection();
	app.events = new EventsCollection();

	app.list = new EventListView();
}

$(document).ready(onDocumentReady);