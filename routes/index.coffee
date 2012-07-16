# GET home page
exports.index = (req, res)->
	res.render "index",
		title: res.lingua.content.welcome
		desc: "Aplicaciones web para Guild Wars 2, mapa interactivo para Mundo contra Mundo (WvW), dibuja estrategias para tu clan y míralo en tiempo real."
		bodyclass: "home"

# GET WvW page
exports.wvw = (req, res)->
	res.render "map",
		layout: false
		title: res.lingua.content.wvw
		desc: "Visualiza y elabora estrategias para Mundo vs Mundo (WvW) de Guild Wars 2. Crea tu canal en tiempo real para tu clan."
		bodyclass: "map"
		
# Channel page
exports.channel = (req, res)->
	res.render "map",
		layout: false
		title: res.lingua.content.channel + " " + req.params.channel + " | " + res.lingua.content.wvw
		desc: "Visualiza y elabora estrategias para Mundo vs Mundo (WvW) de Guild Wars 2. Crea tu canal en tiempo real para tu clan."
		bodyclass: "map"