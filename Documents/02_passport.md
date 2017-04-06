# Passport Setup
Set up passport for webInit

### Proecss 
1. install passport modules passport-local-sequelize connect-flash express-session helmet
>$npm install --save passport

>$npm install --save passport-local

>$npm install --save passport-local-sequelize

>$npm install --save connect-flash

>$npm install --save express-session

>$npm install --save helmet

2. test connect sqlite and create User table
	in testJS/test.js
	
	>$node test.js

3. User crypto
	in testJS/crypto.js
	
	>$node crypto.js

4. Edit app.js
```javascript
var crypto = require('crypto');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var routes = require('./routes/index');
var User = require('./models/user');
app.use(session({secret:'dave test'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

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
        done(null,user);
      } else {
        return done(null,false,req.flash('LoginMessage',' Password Wrong'));
      }
    }
  });
}));
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
}));
```

5. Setup Models for Users
>in models/user.js
```javascript
var Sequelize = require('sequelize');
var sequelize = new Sequelize('database',null,null,{
  dialect:'sqlite',
  storage:'./db/mydb.sqlite'
});

var User = sequelize.define('User',{
  name : Sequelize.STRING,
  password : Sequelize.STRING,
  mysalt : Sequelize.STRING,
  createdAt : Sequelize.DATE,
  updatedAt : Sequelize.DATE
});
module.exports = User;
```

6. Setup Router for login
>in routes/index.js
```javascript
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
```
