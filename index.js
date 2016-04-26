var express = require('express');
var app = express();
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser')
var flash = require('connect-flash');
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
  var user = req.body.usernamel
  var pass= req.body.password;
  db.user.authenticate(user, pass, function(err, user){
    // user successfully logged in
    if(user){
      console.log('GOT USER', user.username);
      req.flash('success', 'Successfully logged in.');
      res.redirect('/tweets');
    }
  })
})


app.get('/account/signup', function(req, res) {
  res.render('signup'), {alerts: req.flash()};
});

app.post('/account/signup', function(req, res) {
	console.log(req.body);
if(parseInt(req.body.age_verification) <21){
	return res.redirect('/');
}
  console.log(req.body.age_verification)
  console.log(parseInt(req.body.age_verification, 10))
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
			res.redirect('/');
		}else {
			res.redirect('/account/signup');
		}
	}).catch(function(err){
		req.flash('danger', err.message);
		console.log("error:", err);
		res.send(err);
	})
});


var port = 3000;
app.listen(port, function() {
  console.log("You're listening to the smooth sounds of port " + port);
});  
