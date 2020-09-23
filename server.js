var express = require("express");
var app = express();
var path = require('path');

app.use("/assets", express.static(__dirname + "/assets"));

app.set("view engine", "ejs");
app.use(require("./routes"));
app.listen(process.env.PORT || 7080);