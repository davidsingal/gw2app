'use strict';

define([
  'jquery',
  'underscore',
  'backbone',
  '../collections/world-names'
], function($, _, Backbone, WorldNamesCollection) {

  var WorldSelectorView = Backbone.View.extend({

    el: '#worldSelector',

    initialize: function() {
      this.worldNames = new WorldNamesCollection();
      this.$btn = $('#changeWorldBtn');
      this.$name = $('#worldName');
      this.setEvents();
    },

    setEvents: function() {
      var self = this,
        html = '<ul>';

      function onClickWorld(e) {
        var $this = $(e.currentTarget);
        var currentWorld = $this.data('world');

        self.$el.find('a').removeClass('current');
        self.$name.text($this.text());
        self.$el.removeClass('active');
        self.$btn.removeClass('active');
        $this.addClass('current');

        sessionStorage.setItem('currentWorld', currentWorld);

        Backbone.Events.trigger('change:world');

        e.preventDefault();
      }

      function onDataSuccess(collection) {
        html = '<ul>';

        _.each(collection.toJSON(), function(world) {
          if (sessionStorage.getItem('currentWorld') === parseInt(world.id)) {
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
          self.worldNames.fetch({
            success: onDataSuccess
          });
        }

        self.$btn.toggleClass('active');
      });
    }

  });

  return WorldSelectorView;

});
