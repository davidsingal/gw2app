var EventListView = Backbone.View.extend({
	el: '#eventList',
	highEvents: [
		'31CEBA08-E44D-472F-81B0-7143D73797F5',
		'33F76E9E-0BB6-46D0-A3A9-BE4CDFC4A3A4',
		'C5972F64-B894-45B4-BC31-2DEEA6B7C033',
		'03BF176A-D59F-49CA-A311-39FC6F533F2F',
		'568A30CF-8512-462F-9D67-647D69BEFAED',
		'9AA133DC-F630-4A0E-BB5D-EE34A2B306C2',
		'2555EFCB-2927-4589-AB61-1957D9CC70C8',
		'0372874E-59B7-4A8F-B535-2CF57B8E67E4',
		'7EF31D63-DB2A-4FEB-A6C6-478F382BFBCB',
		'C8139970-BE46-419B-B026-485A14002D44',
		'E16113B1-CE68-45BB-9C24-91523A663BCB',
		'99254BA6-F5AE-4B07-91F1-61A9E7C51A51',
		'7EF31D63-DB2A-4FEB-A6C6-478F382BFBCB',
		'F66922B5-B4BD-461F-8EC5-03327BD2B558',
		'02DECBE6-A0BA-47CC-9256-A6D59881D92A',
		'B1B94EFD-4F67-4716-97C2-880CD16F1297',
		'E87A021D-4E7C-4A50-BEDB-6F5A54C90A9A',
		'D7246CA2-DD85-42B3-A8D3-D2A1FE464ECF',
		'5761F5A5-48D2-484B-BE21-22096E84E845',
		'3D333172-24CE-47BA-8F1A-1AD47E7B69E4',
		'351F7480-2B1C-4846-B03B-ED1B8556F3D7',
		'7E24F244-52AF-49D8-A1D7-8A1EE18265E0',
		'A5B5C2AF-22B1-4619-884D-F231A0EE0877',
		'F7D9D427-5E54-4F12-977A-9809B23FBA99',
		'B4E6588F-232C-4F68-9D58-8803D67E564D',
		'E6872A86-E434-4FC1-B803-89921FF0F6D6',
		'95CA969B-0CC6-4604-B166-DBCCE125864F',
		'242BD241-E360-48F1-A8D9-57180E146789',
		'295E8D3B-8823-4960-A627-23E07575ED96',
		'A0796EC5-191D-4389-9C09-E48829D1FDB2',
		'36E81760-7D92-458E-AA22-7CDE94112B8F',
		'C876757A-EF3E-4FBE-A484-07FF790D9B05',
		'3070F2C0-46DD-498F-BBF6-695439B90CC5'
	],
	initialize: function() {
		var self = this;

		self.showList()

		setTimeout(function() {
			self.showList()
		}, 10000);
	},
	showList: function() {
		var self = this,
			events = [],
			hightEvents = [],
			highHTMLList = '<table><tr><th>Mapa</th><th>Evento destacado</th><th>Estado</th></tr>';
			htmlList = '<table><tr><th>Mapa</th><th>Evento</th><th>Estado</th></tr>';

		app.events.getEvents(function(collection) {
			events = collection.toJSON();
			high = _.filter(events, function(event) {
				for (var e = 0, elen = self.highEvents.length; e < elen; e++) {
					if (event.event_id === self.highEvents[e]) {
						return event;
					}
				}
			});

			for (var i = 0, len = events.length; i < len; i++) {
				htmlList += '<tr><td>' + events[i].map + '</td><td>' + events[i].name + '</td><td>' + events[i].state + '</td>';
			}

			htmlList += '</table>';

			for (var h = 0, hlen = high.length; h < hlen; h++) {
				highHTMLList += '<tr><td>' + high[h].map + '</td><td>' + high[h].name + '</td><td>' + high[h].state + '</td>';
			}

			highHTMLList += '</table>';

			self.$el
				.empty()
				.append(highHTMLList)
				.append(htmlList);
		});
	}
});