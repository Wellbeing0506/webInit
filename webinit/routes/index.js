var express = require('express');
var router = express.Router();
var passport = require('passport');

var Sequelize = require('sequelize');
var sequelize = new Sequelize('database',null,null,{
  dialect:'sqlite',
  storage:'./db/mydb.sqlite'
});

router.post('/',
	passport
	.authenticate('local-login',{
		successRedirect : '/myTemp',
		failureRedirect : '/',
		failureFlash: true,
	})
);

router.get('/',function(req,res,next) {
	console.log(req.session.cookie);
	if(req.session.cookie._expires || req.session.cookie.originalMaxAge) {
  //	res.render('myTemp.ejs', { message: req.user.name, table:results });
	sequelize.query("select * from t1;").spread(function(results,meta){
		console.log(results,meta);
  	res.render('myTemp.ejs', { message: req.user.name, table:results});
	});
	} else {
		res.render('index.ejs', { message:req.flash('LoginMessage')});
	}
});

router.get('/signup', function(req, res,next) {  
  res.render('signup.ejs', { message: req.flash('SignupMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) {  
  res.render('profile.ejs', { username: "ok" ,password:"ppp",message: req.user.dataValues.name });
});

router.get('/sidemenu', isLoggedIn, function(req, res) {  
	sequelize.query("select * from t1;").spread(function(results,meta){
		console.log(results,meta);
  	res.render('sidemenu.ejs', { username: "ok" ,password:"ppp",message: req.user.name, table:results});
	});
  //res.render('sidemenu.ejs', { username: "ok" ,password:"ppp",message: req.user.name });
});

router.get('/myTemp', isLoggedIn, function(req, res) {  
	sequelize.query("select * from t1;").spread(function(results,meta){
		console.log(results,meta);
  	res.render('myTemp.ejs', { username: "ok" ,password:"ppp",message: req.user.name, table:results});
	});
});

router.get('/logout', function(req, res) {  
	req.session.cookie.maxAge = null;
  req.logout();
  res.redirect('/');
});


router.post('/signup',
	passport.authenticate('local-signup',{
		successRedirect : '/myTemp',
		failureRedirect : '/signup',
		failureFlash: true 
}));

module.exports = router;

function isLoggedIn(req, res, next) {  
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}


