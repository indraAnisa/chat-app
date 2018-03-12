var socket = io();

socket.on("connect", () => {
  console.log("Conected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("newMessage", function(msg) {
  console.log("New message ", msg);
  var li = $("<li></li>");
  li.text(`${msg.from}: ${msg.text}`);

  $("#messages").append(li);
});

socket.on("newLocationMessage", function(message) {
  var li = $("<li></li>");
  var a = $('<a target="_blank">My current location</a>');

  li.text(`${message.from}: `);
  a.attr("href", message.url);

  li.append(a);
  $("#messages").append(li);
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

  locationButton.attr('disabled','disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition(
    function(position) {
      locationButton.removeAttr('disabled').text('Send Location');;
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function() {
      locationButton.removeAttr('disabled').text('Send Location');
      alert("unable to fetch location.");
    }
  );
});
