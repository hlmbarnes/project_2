var express = require('express');
var app = express();
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser')
var flash = require('connect-flash');

var session = require('express-session');

var db = require('./models')

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
		req.currentUser= false;
		res.locals.currentUser = false;
		next();
	}
})

app.get('/', function(req, res) {
  res.render('index', {alerts: req.flash()});
});

app.post('/account/signin', function(req, res){
  // proving we get the username and password
  var user = req.body.username;
  var pass= req.body.password;
  if(user !=undefined){
  db.user.authenticate(user, pass, function(err, user){
    // user successfully logged in
    if(user){
      console.log('GOT USER', user.username);
      req.session.userId = user.id;
      req.flash('success','Successfully logged in, click <a href="/map">map</a> to search');
      res.redirect('/');
    }else{
    	req.flash('danger', 'Invalid password or username');
    	res.redirect('/');
    }
  })
} else{
	   	req.flash('danger', 'Invalid password or username');
    	res.redirect('/');
}
})



app.get('/account/login', function(req, res) {
  res.render('login');
});

app.get('/logout', function(req, res) {
  req.session.userId = undefined;
  req.flash('info', 'Successfully logged out.');
  // req.session.destroy();
  res.redirect('/');
});

app.get('/map', function(req, res){
	if (req.session.userId !== undefined)
	{
	  res.render('map'); 	 
	}else {
		req.flash('danger','You must log in first - please click <a href="/account/login">log in</a> to search ')
		res.redirect('/');
	}
});

app.post('/map', function(req,res){
    console.log('button clicked');
});

app.post('/account/signup', function(req, res) {
	// console.log(req.body);
if(parseInt(req.body.age_verification) <21){
	req.flash('danger', "You're not old enough to use this site!");
	// req.flash("You\'re not old enough to use this site!");
	return res.redirect('/');
}
  console.log(req.body.age_verification)
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
			req.session.userId = user.id;
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



app.get("/favorites", function (req, res){

	 if (req.session.userId !== undefined)
	 {
	  db.favorite.findAll(
	{
			where: {userId: req.session.userId}}
			).then(function(favorites){
		//console.log(favorites);
			res.render("favorites", {favorites: favorites});
		});
	} else{
		req.flash('danger','You must log in first - please click <a href="/account/login">log in</a> to search ')
		res.redirect('/');
	}
});

app.post('/favorites', function(req, res){
	var brewery = req.body.name;
	var address = req.body.address;
	var phone = req.body.phone;

	//console.log(req.session);
	//console.log(req.body);
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

app.delete('/favorites', function(req, res){
	console.log(req.body.id);
	db.favorite.destroy({where: {id:req.body.id}}).then(function(favorite){
		res.status(200).send("Successfully deleted a favorite");
	})
})

app.listen(process.env.PORT || 3000)


