var express = require('express');
var router = express.Router();
var passport = require('passport');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'Express' });
});

router.post('/login',
	passport.authenticate('local-login',{
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash: true,
}));

router.get('/login',function(req,res,next) {
  res.render('login.ejs', { message:req.flash('LoginMessage')});
});

router.get('/signup', function(req, res,next) {  
  res.render('signup.ejs', { message: req.flash('SignupMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) {  
  res.render('profile.ejs', { username: "ok" ,password:"ppp",message: req.user.name });
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


