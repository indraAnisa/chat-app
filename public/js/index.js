var socket = io();

socket.on("connect", () => {
  console.log("Conected to server");
  socket.emit('createMessage',{
      from:'indra',
      text:'hey this is indra'
  })
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on('newMessage',function(msg){
    console.log("New message ", msg)
})
