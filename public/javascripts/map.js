(function() {
  var cartoDB, drawCanvas, map, siegeTools, win;

  win = $(window);

  map = null;

  cartoDB = {
    init: function() {
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
        query: "SELECT cartodb_id, name_" + lang + ", type, descrip_" + lang + ", score, ST_Transform(ST_Buffer(the_geom,0.001), 3857) as the_geom_webmercator FROM {{table_name}}",
        interactivity: "name_" + lang + ", type, descrip_" + lang + ", score",
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
          if (data["name_" + lang]) {
            infowindow += "<p><strong>" + data["name_" + lang] + "</strong></p>";
          }
          if (data.score) {
            infowindow += "<p class=\"score\">" + data.score + "</p>";
          }
          if (data["descrip_" + lang]) {
            infowindow += "<p class=\"descrip\">" + data["descrip_" + lang] + "</p>";
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
      return canvas.height = win.height();
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
      canvas.height = window.innerHeight;
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
      var circle, circleMove, colour, dist, icon, iconOptions, id, marker, self, trebuchetIcon;
      self = $(this);
      colour = self.data("colour");
      dist = self.data("dist");
      id = self.attr("id");
      switch (id) {
        case "trebuchet":
          iconOptions = {
            iconUrl: "/images/assets/trebuchet-icon.png",
            iconSize: new L.Point(30, 26)
          };
          break;
        case "catapult":
          iconOptions = {
            iconUrl: "/images/assets/catapult-icon.png",
            iconSize: new L.Point(30, 27)
          };
          break;
        case "ram":
          iconOptions = {
            iconUrl: "/images/assets/ram-icon.png",
            iconSize: new L.Point(30, 27)
          };
          break;
        case "arrow":
          iconOptions = {
            iconUrl: "/images/assets/arrow-icon.png",
            iconSize: new L.Point(30, 27)
          };
          break;
        case "ballista":
          iconOptions = {
            iconUrl: "/images/assets/ballista-icon.png",
            iconSize: new L.Point(30, 27)
          };
          break;
        default:
          iconOptions = {};
      }
      trebuchetIcon = L.Icon.extend(iconOptions);
      icon = new trebuchetIcon();
      marker = new L.Marker(map.getCenter(), {
        draggable: true,
        icon: icon
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

  win.load(function() {
    cartoDB.init();
    drawCanvas.size();
    drawCanvas.init();
    return siegeTools.init();
  });

  win.resize(function() {
    return drawCanvas.size();
  });

}).call(this);
