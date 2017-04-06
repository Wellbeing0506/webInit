var express = require('express');
var router = express.Router();
var passport = require('passport');

router.post('/',
	passport
	.authenticate('local-login',{
		successRedirect : '/profile',
		failureRedirect : '/',
		failureFlash: true,
	})
);

router.get('/',function(req,res,next) {
	if(req.session.cookie._expires) {
  	res.render('profile.ejs', { message: req.user.name });
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
  res.render('sidemenu.ejs', { username: "ok" ,password:"ppp",message: req.user.name });
});

router.get('/myTemp', isLoggedIn, function(req, res) {  
  res.render('myTemp.ejs', { username: "ok" ,password:"ppp",message: req.user.name });
});

router.get('/logout', function(req, res) {  
  req.logout();
  res.redirect('/');
});


router.post('/signup',
	passport.authenticate('local-signup',{
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash: true 
}));

module.exports = router;

function isLoggedIn(req, res, next) {  
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}


