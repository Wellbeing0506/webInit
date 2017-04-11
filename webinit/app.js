var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var crypto = require('crypto');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var helmet = require('helmet');

var json2xls = require('json2xls');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet());

app.use(json2xls.middleware);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('dave cookie'));
app.use(express.static(path.join(__dirname, 'public')));
var routes = require('./routes/index');
var points = require('./routes/points');
var User = require('./models/user');

var expiryDate = new Date(Date.now() + 60*60*1000);
app.use(session({
	secret:'dave test',
	name:'sessionId',
	httpOnly:true,
	expires:expiryDate
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req,res,next){
var ip = req.headers['x-forwarded-for'] ||
req.connection.remoteAddress || 
req.socket.remoteAddress ||
req.connection.socket.remoteAddress;
console.log("IP:",ip);
	if(req.method=='POST' && req.url=='/') {
		if(req.body.remember === "yes" ) {
			req.session.cookie.maxAge = 30*24*60*60*1000;
		} else {
			req.session.cookie.expires = false;
		}
	}
	next();
});

passport.serializeUser(function(user,done){
	return done(null,user);
});
passport.deserializeUser(function(id,done){
	User.findById(id.id).then(function(user){
		return done(null,user);
	});
});

passport.use('local-login',
	new LocalStrategy({
		nameField : 'name',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req,username,password,done){
		User.findOne(
			{where:{name:username}}
		).then(function(user){
			if(!user) {
				return done(null,false,req.flash('LoginMessage','  No User'));
			}
			if(user) {
				var passwd = crypto.createHash('sha1').update(password).digest('hex');
				if(user.dataValues.password === passwd) {
					req.session.cookie.originalMaxAge = expiryDate;
					done(null,user);
				} else {
					return done(null,false,req.flash('LoginMessage',' Password Wrong'));
				}
			}
		});
	})
);

passport.use('local-signup',
	new LocalStrategy({
		nameField : 'name',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req,username,password,done){
		process.nextTick(function(){
			User.findOne({where:{name:username}}).then(
				function(user) {
					if(user) {
						return done(null,false,req.flash('SignupMessage','username has existed'));
					} else {
						var passwd = crypto.createHash('sha1').update(password).digest('hex');		
						User.create({name:username,password:passwd,mysalt:"salt"});
						return done(null,username);
					}
				}	
			);
		});	
	})
);

app.use('/', routes);
app.use('/points', points);
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
