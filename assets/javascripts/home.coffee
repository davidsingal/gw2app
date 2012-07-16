socket = io.connect "http://localhost:3000"

$(window).load ->
	$("div.layer1, div.layer2").addClass "active"
	socket.emit "message", 
		hello: "bye"