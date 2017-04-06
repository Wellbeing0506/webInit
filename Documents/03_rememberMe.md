# Passport Setup
Set up Remember Me for webInit

### Proecss 
1. install passport-remember-me 
>$npm install --save passport-remember-me

2. in app.js
>$vim app.js
"
app.use(function(req,res,next){
  if(req.method=='POST' && req.url=='/') {
    if(req.body.remember === "yes" ) {
      req.session.cookie.maxAge = 600*1000;
    } else {
      req.session.cookie.expires = false;
    }
  }
  next();
});

"

### Add check box
1. edit view/index.ejs
>$vim view/index.ejs
"
<input type="checkbox" name="remember" value="yes"> Remember Me<br>
"
