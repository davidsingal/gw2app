(function() {
  var socket;

  socket = io.connect("http://localhost:3000");

  $(window).load(function() {
    $("div.layer1, div.layer2").addClass("active");
    return socket.emit("message", {
      hello: "bye"
    });
  });

}).call(this);
