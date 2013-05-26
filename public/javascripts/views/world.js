var WorldSelector = Backbone.View.extend({
	el: '#worldSelector',
	initialize: function() {
		this.$btn = $('#changeWorldBtn');
		this.$name = $('#worldName');
		this.setEvents();
	},
	setEvents: function() {
		var self = this,
			html = '<ul>';

		function onClickWorld(e) {
			var $this = $(this);

			self.$el.find('a').removeClass('current');
			self.$name.text($this.text());
			self.$el.removeClass('active');
			self.$btn.removeClass('active');
			$this.addClass('current');

			app.currentWorld = $this.data('world');

			clearInterval(app.timer);

			app.events.updateDate(app.currentWorld, function(collection) {
				app.map.showEventLayer();
			});

			app.timer = setInterval(function() {
				app.events.updateDate(app.currentWorld, function(collection) {
					app.map.showEventLayer();
				});
			}, 5000);

			e.preventDefault();
		}

		function onDataSuccess(collection, data) {
			html = '<ul>';

			_.each(collection.toJSON(), function(world) {
				if (app.currentWorld === parseInt(world.id)) {
					html += '<li><a class="current" href="#" data-world="' + world.id + '">' + world.name + '</a></li>';
				} else {
					html += '<li><a href="#" data-world="' + world.id + '">' + world.name + '</a></li>';
				}				
			});

			html += '</ul>';

			self.$el.html(html)
				.addClass('active')
				.find('a').on('click', onClickWorld);
		}

		this.$btn.on('click', function() {
			if (self.$btn.hasClass('active')) {
				self.$el.removeClass('active');
			} else {
				app.worldNames.fetch({
					success: onDataSuccess
				});
			}

			self.$btn.toggleClass('active');
		});
	}
});