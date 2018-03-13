var socket = io();

socket.on("connect", () => {
  console.log("Conected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("newMessage", function(msg) {
  var formattedTime = moment(msg.createdAt).format("h:mm a");
  var template = $("#message-template").html();
  var html = Mustache.render(template, {
    text: msg.text,
    from: msg.from,
    createdAt: formattedTime
  });

  $("#messages").append(html);
});

socket.on("newLocationMessage", function(message) {
  var formattedTime = moment(message.createdAt).format("h:mm a");

  var template = $("#location-message-template").html();
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });

  $("#messages").append(html);
});

$("#message-form").on("submit", function(e) {
  e.preventDefault();

  socket.emit(
    "createMessage",
    {
      from: "User",
      text: $("#message").val()
    },
    function() {
      $("#message").val("");
    }
  );
});

var locationButton = $("#send-location");

locationButton.on("click", function() {
  if (!navigator.geolocation) {
    return alert("Geolocation is not suppported by your browser");
  }

  locationButton.attr("disabled", "disabled").text("Sending Location...");

  navigator.geolocation.getCurrentPosition(
    function(position) {
      locationButton.removeAttr("disabled").text("Send Location");
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function() {
      locationButton.removeAttr("disabled").text("Send Location");
      alert("unable to fetch location.");
    }
  );
});
