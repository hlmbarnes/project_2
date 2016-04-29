var express = require('express');
var app = express();
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser')
var flash = require('connect-flash');

// var BreweryDb = require('brewerydb-node');
// var brewdb = new BreweryDb('BREWERYDB_KEY');
var session = require('express-session');

var db = require('./models')

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/static'));

app.use(session({
  secret: 'abcdefgh',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

app.use(function(req,res, next){
  if (req.session.userId){
	  db.user.findById(req.session.userId).then(function(user){
	    req.currentUser = user;
	    namelres.locals.currentUser = usernamelnext();
	    next()
	  }).catch(function() {
	  	next()
	  })
	} else {
		next();
	}
})

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/account/signin', function(req, res){
  // proving we get the username and password
  console.log("sign in:", req.body);
  var user = req.body.username;
  var pass= req.body.password;
  db.user.authenticate(user, pass, function(err, user){
    // user successfully logged in
    if(user){
      console.log('GOT USER', user.username);
      req.session.userId = user.id;
      req.flash('loginstatus', 'Successfully logged in.');
      res.redirect('/map');
    }else{
    	req.flash('loginstatus', 'Failed to Log in');
    	res.redirect('/account/login');
    }
  })
})


app.get('/account/signup', function(req, res) {
  res.render('signup', {loginstatus: req.flash('loginstatus')});
});

app.get('/account/login', function(req, res) {
  res.render('login', {loginstatus: req.flash('loginstatus')});
});


app.get('/map', function(req, res){
	// brewdb.breweries.getById("avMkil", {}, function(err, data)  
	// brewdb.beer.getById(["avMkil", "XcvLTe"], { withBreweries: "Y" }, function(
		res.render('map', {loginstatus: req.flash('loginstatus')}); 

});
app.post('/map', function(req,res){
    console.log('button clicked');
});

app.post('/account/signup', function(req, res) {
	console.log(req.body);
if(parseInt(req.body.age_verification) <21){
	req.flash("You\'re not old enough to use this site!");
	return res.redirect('/');
}
  console.log(req.body.age_verification)
  // console.log(parseInt(req.body.age_verification, 10))
	db.user.findOrCreate({
		where: {
			username: req.body.username,
		},
		defaults: {
			password: req.body.password,
			age: parseInt(req.body.age_verification, 10)
		}
	}).spread(function(user, isNew){
		if(isNew){
			res.redirect('/map');
		}else {
			res.redirect('/map');
		}
	}).catch(function(err){
		req.flash('danger', err.message);
		console.log("error:", err);
		res.send(err);
	})
});

app.post('/favorites', function(req, res){
	var brewery = req.body.name;
	var address = req.body.address;
	var phone = req.body.phone;

	console.log(req.session);
	console.log(req.body);
	db.favorite.findOrCreate({
		where: {
			userId: req.session.userId,
			name: brewery
		},
		defaults: {
			address: address,
			phoneNumber: phone 
		}
	}).spread(function(favorite, isNew){
		console.log(favorite);
		console.log(isNew);
		if(isNew){
			res.redirect('/favorites');
		}else {
			res.redirect('/favorites');
		}
	}).catch(function(err){
		res.send(err);
	})
});

app.get("/favorites", function (req, res){
	db.favorite.findAll().then(function(favorites){
		console.log(favorites);
		res.render("favorites", {favorites: favorites});
	});
});

app.listen(process.env.PORT || 3000)
// var port = 3000;
// app.listen(port, function() {
//   console.log("You're listening to the smooth sounds of port " + port);
// });  

