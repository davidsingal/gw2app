(function() {
  var cartodbMap, lang;

  lang = "es";

  cartodbMap = function() {
    var bounds, map, northEast, popup, southWest, tiles, wvw;
    southWest = new L.LatLng(-0.033179, -0.000004);
    northEast = new L.LatLng(0.000004, 0.0477410);
    bounds = new L.LatLngBounds(southWest, northEast);
    tiles = new L.TileLayer("/images/wvw/{z}/{x}/{y}.jpg", {
      minZoom: 16,
      maxZoom: 18
    });
    map = new L.Map("wvwMap", {
      center: bounds.getCenter(),
      zoom: 16,
      minZoom: 16,
      maxZoom: 18,
      maxBounds: bounds
    });
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
        infowindow = void 0;
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
      debug: false
    });
    map.addLayer(tiles, true);
    return map.addLayer(wvw, true);
  };

  window.onload = function() {
    return cartodbMap();
  };

}).call(this);
