const path = require("path");
const express = require("express");

require('./config/config')

const publicPath = path.join(__dirname, "/public");

var app = express();
const port = process.env.PORT;


app.get('',(req,res)=>{
    res.send("Hello world");
})

app.listen(port, () => {
  console.log("started on port ", port);
});

module.exports = {
  app
};
