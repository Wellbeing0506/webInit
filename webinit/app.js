var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var crypto = require('crypto');
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./db/mydb.sqlite');
var flash = require('connect-flash');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

var routes = require('./routes/index');
//var users = require('./routes/users');
var User = require('./models/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret:'dave test'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//passport.use(new LocalStrategy(
//	function(username,password,done){
//		User.find({where:{name:username}})
//				.success(function(user){
//					console.log(user);
//					done(null,user);
//				})
//				.error(function(err){
//					console.log(err);
//					done(err);
//				});
//	}));

passport.use('local-login',
new LocalStrategy({
	nameField : 'name',
	passwordField : 'password',
	passReqToCallback : true
},
function(req,username,password,done){
	console.log(username,password);
	User.findOne({where:{name:username}}).then(function(user) {
		console.log(user);
	});
	//User.findOne({'name':username},function(err,user){
	//		if(err) {
	//			console.log("some",err)
	//			return done(err);
	//		} 
	//		if(!user) {
	//			console.log("no");
	//			return done(null,false,req.flash('loginMessage', 'No user found.'));
	//		}
	//		cosnole.log(user);
	//		return done(null,user);
	//});
}));
passport.serializeUser(function(user,done){
	return done(null,user.id);
});
passport.deserializeUser(function(id,done){
	db.get('select id, name, password from Users where id ="',id, function(err,row){
		return done(null,row);
	});	
});



app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
