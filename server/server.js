const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

require("./config/config");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected");
  socket.on("disconnect", () => {
    console.log("user was disconnected");
  });

  socket.emit('newMessage',{
    from:'Admin',
    text: 'Welcome to the chat app',
    createdAt : new Date().getTime()
  })

  socket.broadcast.emit('newMessage',{
    from: 'Admin',
    text: 'New user joined',
    createdAt : new Date().getTime()
  })


  socket.on("createMessage", newMessage => {
    newMessage.createdAt = Date().toLocaleLowerCase();
    console.log("createMessage", newMessage);
    io.emit('newMessage', {
        from: newMessage.from,
        text: newMessage.text,
        createdAt: new Date().getTime(),
    })
    // socket.broadcast.emit("newMessage", {
    //   from: newMessage.from,
    //   text: newMessage.text,
    //   createdAt: new Date().getTime()
    // });
  });
});

server.listen(port, () => {
  console.log("started on port ", port);
});

module.exports = {
  app
};
