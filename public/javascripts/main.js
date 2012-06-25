(function() {
  var cartoDB, drawCanvas, win;

  win = $(window);

  cartoDB = {
    init: function() {
      return this.size();
    },
    size: function() {
      return $("div#map").css("height", win.height() - 32);
    },
    launch: function() {
      var bounds, map, northEast, popup, southWest, tiles, wvw;
      southWest = new L.LatLng(-0.033142, 0);
      northEast = new L.LatLng(0, 0.047688);
      bounds = new L.LatLngBounds(southWest, northEast);
      tiles = new L.TileLayer("/images/maps/wvw/{z}/{x}/{y}.png", {
        minZoom: 16,
        maxZoom: 20
      });
      map = new L.Map("map", {
        center: bounds.getCenter(),
        zoom: 16,
        minZoom: 16,
        maxZoom: 20,
        maxBounds: bounds
      });
      map.addLayer(tiles, true);
      popup = new L.CartoDBPopup();
      wvw = new L.CartoDBLayer({
        map: map,
        user_name: "darkit",
        table_name: "wvw",
        query: "SELECT * FROM {{table_name}}",
        featureOver: function(ev, latlng, pos, data) {
          return document.body.style.cursor = "pointer";
        },
        featureOut: function() {
          return document.body.style.cursor = "default";
        },
        featureClick: function(ev, latlng, pos, data) {
          ev.stopPropagation();
          popup.setContent(data);
          popup.setLatLng(latlng);
          return map.openPopup(popup);
        },
        auto_bound: false,
        debug: true
      });
      map.addLayer(wvw);
      return map.on("moveend", function(e) {
        return console.log(map.getBounds());
      });
    }
  };

  drawCanvas = {
    vars: {
      canvas: $("canvas#canvas")
    },
    init: function() {
      this.size();
      this.showCanvas();
      return this.draw();
    },
    size: function() {
      return this.vars.canvas.css("height", win.height() - 32);
    },
    showCanvas: function() {
      return $("a#drawButton").click(function(e) {
        var self;
        e.preventDefault();
        self = this;
        return drawCanvas.vars.canvas.stop().fadeToggle(function() {
          return $(self).toggleClass("active");
        });
      });
    },
    draw: function() {
      var canvas, context;
      canvas = document.getElementById("canvas");
      context = canvas.getContext("2d");
      if (context) {
        context.strokeStyle = "#000000";
        context.lineWidth = 3;
        context.scale(1, 1);
        context.strokeRect(0, 0, canvas.width, canvas.height);
        return context.stroke();
      }
    }
  };

  $(function() {
    cartoDB.init();
    return drawCanvas.init();
  });

  win.load(function() {
    cartoDB.launch();
    return drawCanvas.size();
  });

  win.resize(function() {
    return cartoDB.size();
  });

}).call(this);
