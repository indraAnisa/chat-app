const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

require("./config/config");

const { generateMessage , generateLocationMessage} = require("./utils/message");
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

  socket.emit(
    "newMessage",
    generateMessage("Admin", "Welcome to the chat app")
  );

  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "New user joined the room")
  );

  socket.on("createMessage", (newMessage, callback) => {
    console.log("createMessage", newMessage);
    io.emit("newMessage", generateMessage(newMessage.from, newMessage.text));
    callback();
  });

  socket.on("createLocationMessage", coords => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude )
    );
  });
});

server.listen(port, () => {
  console.log("started on port ", port);
});

module.exports = {
  app
};
