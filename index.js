var express = require('express');
var app = express();
var ejsLayouts = require('express-ejs-layouts');
// var db = require('./models')

var app = express();
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(express.static(__dirname + '/static'));


app.get('/', function(req, res) {
  res.send('Welcome to Hoppy Hour');
});

var port = 3000;
app.listen(port, function() {
  console.log("You're listening to the smooth sounds of port " + port);
});  
