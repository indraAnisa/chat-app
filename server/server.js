const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

require("./config/config");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const publicPath = 'public';
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");

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

    var nameExist = users.getUserByName(params.name);

    if(nameExist){
      return callback(`name: ${params.name} already exist, please use other name.`)
    }

    params.room = params.room.toUpperCase(); //non case sensitve rooms name

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));
    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat app")
    );

    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMessage("Admin", `${params.name} has joined.`)
      );
    callback();
  });

  socket.on("createMessage", (newMessage, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(newMessage.text)) {
      io
        .to(user.room)
        .emit("newMessage", generateMessage(user.name, newMessage.text));
    }

    callback();
  });

  socket.on("createLocationMessage", coords => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "newLocationMessage",
        generateLocationMessage(user.name, coords.latitude, coords.longitude)
      );
    }
  });

  socket.on("disconnect", () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io
        .to(user.room)
        .emit("newMessage", generateMessage("Admin", `${user.name} has left `));
    }
  });
});


app.get('/getRooms',(req,res)=>{
  var rooms = users.getRooms();
  res.send(rooms);
})


server.listen(port, () => {
  console.log("started on port ", port);
});

module.exports = {
  app
};
