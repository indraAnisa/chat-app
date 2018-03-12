var socket = io();

socket.on("connect", () => {
  console.log("Conected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("newMessage", function(msg) {
  console.log("New message ", msg);
  var li = $('<li></li>');
  li.text(`${msg.from}: ${msg.text}`);

  $('#messages').append(li);
});



$('#message-form').on('submit',function(e){
  e.preventDefault();
  
  socket.emit('createMessage', {
    from:'User',
    text: $('#message').val()
  },function(){

  })
});
