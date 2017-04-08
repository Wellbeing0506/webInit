var express = require('express');
var router = express.Router();
var passport = require('passport');
var json2xls = require('json2xls');
var fs = require('fs');

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
	sequelize.query("select * from t1;").spread(function(results,meta){
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
	var output = {};
	sequelize.query("select * from t1;").spread(function(results,meta){
		var total = results.length;
		var pages = (((total/10) % 1) === 0) 
							? parseInt(total/10) 
							: parseInt(total/10) + 1;
		for(var i in results) {
			var page = parseInt(i/10);
			output[page] = (output.hasOwnProperty(page)) ? output[page]: [];
			output[page].push(results[i]);
		}	
  	res.render('sidemenu.ejs', { username: "ok" ,password:"ppp",message: req.user.name, table:results,pages:output});
	});
});
router.get('/xlsx',function(req,res) {
	sequelize.query("select * from t1 where createdTime between \"2017-04-08 00:00:00\" and \"2017-04-08 23:59:58\"").spread(function(results,meta){
		res.xls('data.xlsx',results);
	});
});

router.get('/myTemp', isLoggedIn, function(req, res) {  
	sequelize.query("select * from t1").spread(function(results,meta){
		console.log(meta);
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


