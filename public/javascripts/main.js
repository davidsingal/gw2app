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
      southWest = new L.LatLng(0, 0.047741);
      northEast = new L.LatLng(-0.033179, -0.000004);
      bounds = new L.LatLngBounds(southWest, northEast);
      tiles = new L.TileLayer("/images/maps/wvw/{z}/{x}/{y}.jpg", {
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
      return map.on("moveend", function(e) {});
    }
  };

  drawCanvas = {
    canvas: document.getElementById("canvas"),
    init: function() {
      this.size();
      this.showCanvas();
      return this.draw();
    },
    size: function() {
      var canvas;
      canvas = this.canvas;
      canvas.width = win.width();
      return canvas.height = win.height() - 32;
    },
    showCanvas: function() {
      var canvas;
      canvas = this.canvas;
      return $("a#drawButton").click(function(e) {
        var self;
        e.preventDefault();
        self = this;
        return $(canvas).stop().fadeToggle(function() {
          return $(self).toggleClass("active");
        });
      });
    },
    draw: function() {
      var canvas, context, lastX, lastY;
      canvas = this.canvas;
      canvas = document.getElementById("canvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 32;
      context = canvas.getContext("2d");
      context.scale(1, 1);
      context.strokeStyle = "#000000";
      context.lineWidth = 3;
      context.strokeRect(0, 0, canvas.width, canvas.height);
      lastX = 0;
      lastY = 0;
      return $(canvas).mousemove(function(e) {
        if (lastX === 0) {
          lastX = e.pageX - canvas.offsetLeft;
        }
        if (lastY === 0) {
          lastY = e.pageY - canvas.offsetTop;
        }
        context.beginPath();
        context.moveTo(lastX, lastY);
        lastX = e.pageX - canvas.offsetLeft;
        lastY = e.pageY - canvas.offsetTop;
        context.lineTo(lastX, lastY);
        context.fillRect(lastX, lastY, 2, 2);
        context.closePath();
        return context.stroke();
      });
    }
  };

  $(function() {
    return cartoDB.init();
  });

  win.load(function() {
    cartoDB.launch();
    drawCanvas.size();
    return drawCanvas.init();
  });

  win.resize(function() {
    return cartoDB.size();
  });

}).call(this);
