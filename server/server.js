const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

require("./config/config");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const publicPath = path.join(__dirname, "../public");
const { isRealString } = require("./utils/validation");
const {Users} = require('./utils/users');

const port = process.env.PORT;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected");
  socket.on("disconnect", () => {
    console.log("user was disconnected");
  });

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("name and room name are required");
    }

    socket.join(params.room)
    users.removeUser(socket.id)
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room))
    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat app")
    );
  
    socket.broadcast.to(params.room).emit(
      "newMessage",
      generateMessage("Admin", `${params.name} has joined.`)
    );
    callback();
  });

  socket.on("createMessage", (newMessage, callback) => {
    console.log("createMessage", newMessage);
    io.emit("newMessage", generateMessage(newMessage.from, newMessage.text));
    callback();
  });

  socket.on("createLocationMessage", coords => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
  });

  socket.on('disconnect',()=>{
    var user = users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left `))
    }
  })
});

server.listen(port, () => {
  console.log("started on port ", port);
});

module.exports = {
  app
};
