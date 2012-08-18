(function() {
	
	//Vars
	var map,
		canvas = document.getElementById("canvas"),
		win = $(window);
	
	//Map
	var cartoDB = function() {
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
			//tile_style: "#{{table_name}}{marker-fill:red;}",
			interactivity: "name_" + lang + ", type, descrip_" + lang + ", score",
			featureOver: function(ev, latlng, pos, data) {
				document.body.style.cursor = "pointer";
			},
			featureOut: function() {
				document.body.style.cursor = "default";
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
				map.openPopup(popup);
			},
			auto_bound: false,
			debug: false
		});
		
		map.addLayer(wvw);
	};
	
	//Siege Tools
	var siegeTools = {
		init: function() {
			var icon, siege;
			
			$("button#toolsButton").click(function(e) {
				e.preventDefault();
				
				var self = this;
				
				$("div#siegeTools").stop().fadeToggle(function() {
					$(self).toggleClass("active");
				});
			});
			
			$("div#siegeTools button.icon").click(siegeTools.clickEvent);
		},
		clickEvent: function() {
			
			var self = $(this),
				id = self.attr("id"),
				color = self.data("color"),
				dist = self.data("dist");
				
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
			
			var icon = new L.Icon(iconOptions);
			
			var marker = new L.Marker(map.getCenter(), {
				draggable: true,
				icon: icon
			});
				
			var circle = new L.Circle(marker.getLatLng(), dist, {
				color: color,
				weight: 3
			});
			
			var circleMove = function() {
				circle.setLatLng(marker.getLatLng());
			};
			
			marker.on("drag", circleMove);
			
			marker.on("dblclick", function() {
				map.removeLayer(marker);
				map.removeLayer(circle);
			});
			
			map.addLayer(marker);
			
			map.addLayer(circle);
		}
	};
	
	//Draw
	var drawCanvas = {
		init: function() {
		
			this.size();
			
			var active = false,
				lastX = 0,
				lastY = 0,
				actionButtons = $("div#canvasTools button.icon"),
				colorButtons = $("div#canvasTools button.color"),
				color, context, paint;
			
			$("button#drawButton").click(function(e) {
				e.preventDefault();
				
				var self = this;
				
				$(canvas).stop().fadeToggle(function() {
					$(self).toggleClass("active");
					$("div#canvasTools").fadeToggle();
				});
			});
			
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			
			context = canvas.getContext("2d");
			context.scale(1, 1);
			context.strokeStyle = "#000000";
			context.lineWidth = 3;
			context.strokeRect(0, 0, canvas.width, canvas.height);
			context.closePath();
			
			context.strokeStyle = "#ff0000";
			
			$(canvas).mousedown(function(e) {
				e.preventDefault();
				
				active = true;
				
				paint(e);
				
				context.beginPath();
				context.moveTo(lastX, lastY);
				
				$(canvas).mousemove(function(e) {
					if (active) {
						paint(e);
						context.lineTo(lastX, lastY);
						context.stroke();
					}
				});
			});
			
			$(canvas).mouseup(function(e) {
				e.preventDefault();
				
				if (active) {
					paint(e);
					active = false;
				}
			});
			
			paint = function(e) {
				if (lastX === 0 || lastY === 0) {
					lastX = e.pageX - canvas.offsetLeft;
					lastY = e.pageY - canvas.offsetTop;
				}
				
				lastX = e.pageX - canvas.offsetLeft;
				lastY = e.pageY - canvas.offsetTop;
			};
			
			//Color
			colorButtons.click(function(e) {
				e.preventDefault();
				
				colorButtons.removeClass("active");
				$(this).addClass("active");
				
				color = this.id;
				context.strokeStyle = color;
			});
			
			//Paint
			$("button#paint").click(function(e) {
				e.preventDefault();
				
				actionButtons.removeClass("active");
				$(this).addClass("active");
				
				context.strokeStyle = "#ff0000";
			});
			
			//Erase
			$("button#erase").click(function(e) {
				e.preventDefault();
				
				actionButtons.removeClass("active");
				$(this).addClass("active");
				
				context.strokeStyle = "rgba(255,255,255,0)";
			});
			
			//Clear
			$("button#clear").click(function(e) {
				e.preventDefault();
			
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.strokeStyle = "#000000";
				context.strokeRect(0, 0, canvas.width, canvas.height);
				context.strokeStyle = "#ff0000";
			});
		},
		size: function() {
			canvas.width = win.width();
			canvas.height = win.height();
		}
	};
	
	//Init
	win.load(function() {
		cartoDB();
		siegeTools.init();
		drawCanvas.init();
	});
	
	win.resize(function() {
		drawCanvas.size();
	});


}).call(this);