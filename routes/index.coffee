# GET home page
exports.index = (req, res) ->
	res.render "index",
		title: "Bienvenido"
		desc: "Aplicaciones web para Guild Wars 2, mapa interactivo para Mundo contra Mundo (WvW), dibuja estrategias para tu clan y míralo en tiempo real."
		bodyclass: "home"

# GET WvW page
exports.wvw = (req, res) ->
	res.render "map",
		layout: false
		title: "Mapa World vs World"
		desc: "Visualiza y elabora estrategias para Mundo vs Mundo (WvW) de Guild Wars 2. Crea tu canal en tiempo real para tu clan."
		bodyclass: "map"