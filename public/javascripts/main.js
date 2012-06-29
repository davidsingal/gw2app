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
        query: "SELECT cartodb_id, nombre, tipo, descrip, ST_Transform(ST_Buffer(the_geom,0.001), 3857) as the_geom_webmercator FROM {{table_name}}",
        interactivity: "nombre, tipo, descrip",
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
          if (data.nombre) {
            infowindow += "<tr><th>Nombre:</th><td>" + data.nombre + "</td></tr>";
          }
          if (data.puntuacion) {
            infowindow += "<tr><th>Tipo:</th><td>" + data.puntuacion + "</td></tr>";
          }
          if (data.descrip) {
            infowindow += "<tr><th>Descripci�n:</th><td>" + data.descrip + "</td></tr>";
          }
          infowindow += "</table>";
          popup.setContent(infowindow);
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
