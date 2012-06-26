# GET home page
exports.index = (req, res) ->
	res.render "index",
		title: "GW2 App"
		desc: "Aplicaciones web para Guild Wars 2"
		bodyclass: "home"


# GET WvW page
exports.wvw = (req, res) ->
	res.render "wvw",
		layout: false
		title: "Mapa World vs World"
		desc: "Visualiza y elabora estrategias para Mundo vs Mundo de Guild Wars 2"
		bodyclass: "map"