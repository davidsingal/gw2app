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
      tiles = new L.TileLayer("/images/maps/wvw/16/{x}/{y}.jpg", {
        minZoom: 16,
        maxZoom: 19
      });
      map = new L.Map("map", {
        center: bounds.getCenter(),
        zoom: 16,
        minZoom: 16,
        maxZoom: 19,
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
    init: function() {
      return this.size();
    },
    size: function() {
      return $("canvas#canvas").css("height", win.height() - 32);
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
