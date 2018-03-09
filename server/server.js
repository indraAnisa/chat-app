const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require('http');

require("./config/config");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT;

var app = express();
var server = http.createServer(app)
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New user connected')
    socket.on('disconnect',()=>{
        console.log('user was disconnected')
    })

    socket.emit('newMessage',{
        from:'donald',
        text:'hey whats going on.'
    })

    socket.on('createMessage',(newMessage)=>{
        newMessage.createdAt = Date().toLocaleLowerCase();
        console.log('createMessage', newMessage)
    })
})

server.listen(port, () => {
  console.log("started on port ", port);
});

module.exports = {
  app
};
