var socket = io();

function scrollToBottom() {
  var messages = $("#messages");
  var newMessage = messages.children("li:last-child");

  var clientHeight = messages.prop("clientHeight");
  var scrollTop = messages.prop("scrollTop");
  var scrollHeight = messages.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on("connect", () => {
  var params = $.deparam(window.location.search);

  socket.emit("join", params, function(err) {
    if(err){
      alert(err);
      window.location.href = '/'
    } else {
      console.log("no Error")
    }
  });
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on('updateUserList', function(users){
  var ol = $('<ol></ol>')

  users.forEach(function(user){
    ol.append($('<li></li>').text(user))
  })

  $('#users').html(ol);
})

socket.on("newMessage", function(msg) {
  var formattedTime = moment(msg.createdAt).format("h:mm a");
  var template = $("#message-template").html();
  var html = Mustache.render(template, {
    text: msg.text,
    from: msg.from,
    createdAt: formattedTime
  });

  $("#messages").append(html);
  scrollToBottom();
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
  scrollToBottom();
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
