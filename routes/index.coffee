# GET home page
exports.index = (req, res) ->
	res.render "index",
		title: "Bienvenido"
		desc: "Aplicaciones para Guild Wars 2"


# GET WvW page
exports.wvw = (req, res) ->
	res.render "wvw",
		layout: false
		title: "Mapa World vs World"
		desc: "Mapa"