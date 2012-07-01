(function() {
  var cartoDB, drawCanvas, map, siegeTools, win;

  win = $(window);

  map = null;

  cartoDB = {
    init: function() {
      return this.size();
    },
    size: function() {
      return $("div#map").css("height", win.height() - 32);
    },
    launch: function() {
      var bounds, northEast, popup, southWest, tiles, wvw;
      southWest = new L.LatLng(-0.033179, -0.000004);
      northEast = new L.LatLng(0.000004, 0.0477410);
      bounds = new L.LatLngBounds(southWest, northEast);
      tiles = new L.TileLayer("/images/maps/wvw/{z}/{x}/{y}.jpg", {
        minZoom: 16,
        maxZoom: 18
      });
      map = new L.Map("map", {
        center: bounds.getCenter(),
        zoom: 16,
        minZoom: 16,
        maxZoom: 18,
        maxBounds: bounds
      });
      map.addLayer(tiles, true);
      popup = new L.CartoDBPopup();
      wvw = new L.CartoDBLayer({
        map: map,
        user_name: "darkit",
        table_name: "wvw",
        query: "SELECT cartodb_id, name, type, descrip, score, ST_Transform(ST_Buffer(the_geom,0.001), 3857) as the_geom_webmercator FROM {{table_name}}",
        interactivity: "name, type, descrip, score",
        featureOver: function(ev, latlng, pos, data) {
          return document.body.style.cursor = "pointer";
        },
        featureOut: function() {
          return document.body.style.cursor = "default";
        },
        featureClick: function(ev, latlng, pos, data) {
          var infowindow;
          ev.stopPropagation();
          infowindow = "<table>";
          if (data.name) {
            infowindow += "<p><strong>" + data.name + "</strong></p>";
          }
          if (data.score) {
            infowindow += "<p class=\"score\">" + data.score + " puntos</p>";
          }
          if (data.descrip) {
            infowindow += "<p class=\"descrip\">" + data.descrip + "</p>";
          }
          infowindow += "</table>";
          popup.setContent(infowindow);
          popup.setLatLng(latlng);
          return map.openPopup(popup);
        },
        auto_bound: false,
        debug: true
      });
      return map.addLayer(wvw);
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
      return $("button#drawButton").click(function(e) {
        var self;
        e.preventDefault();
        self = this;
        return $(canvas).stop().fadeToggle(function() {
          return $(self).toggleClass("active");
        });
      });
    },
    draw: function() {
      var active, canvas, context, lastX, lastY, paint;
      canvas = this.canvas;
      canvas = document.getElementById("canvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 32;
      context = canvas.getContext("2d");
      context.scale(1, 1);
      context.strokeStyle = "#000000";
      context.lineWidth = 3;
      context.strokeRect(0, 0, canvas.width, canvas.height);
      context.closePath();
      context.strokeStyle = "#ff0000";
      lastX = 0;
      lastY = 0;
      active = false;
      $(canvas).mousedown(function(e) {
        e.preventDefault();
        paint(e);
        context.beginPath();
        context.moveTo(lastX, lastY);
        active = true;
        return $(canvas).mousemove(function(e) {
          if (active) {
            paint(e);
            context.lineTo(lastX, lastY);
            return context.stroke();
          }
        });
      });
      $(canvas).mouseup(function(e) {
        e.preventDefault();
        if (active) {
          paint(e);
          return active = false;
        }
      });
      return paint = function(e) {
        if (lastX === 0 || lastY === 0) {
          lastX = e.pageX - canvas.offsetLeft;
          lastY = e.pageY - canvas.offsetTop;
        }
        lastX = e.pageX - canvas.offsetLeft;
        return lastY = e.pageY - canvas.offsetTop;
      };
    }
  };

  siegeTools = {
    init: function() {
      var icon, siege;
      siege = null;
      icon = null;
      return $("button#toolsButton").click(function(e) {
        var self;
        e.preventDefault();
        self = this;
        return $("div#tools").stop().fadeToggle(function() {
          $(self).toggleClass("active");
          return $("button.icon").click(siegeTools.clickEvent);
        });
      });
    },
    clickEvent: function() {
      var circle, circleMove, colour, dist, marker, self;
      self = $(this);
      colour = self.data("colour");
      dist = self.data("dist");
      marker = new L.Marker(map.getCenter(), {
        draggable: true
      });
      circle = new L.Circle(marker.getLatLng(), dist, {
        color: colour,
        weight: 3
      });
      circleMove = function() {
        return circle.setLatLng(marker.getLatLng());
      };
      marker.on("drag", circleMove);
      marker.on("dblclick", function() {
        map.removeLayer(marker);
        return map.removeLayer(circle);
      });
      map.addLayer(marker);
      return map.addLayer(circle);
    }
  };

  $(function() {
    return cartoDB.init();
  });

  win.load(function() {
    cartoDB.launch();
    drawCanvas.size();
    drawCanvas.init();
    return siegeTools.init();
  });

  win.resize(function() {
    return cartoDB.size();
  });

}).call(this);
