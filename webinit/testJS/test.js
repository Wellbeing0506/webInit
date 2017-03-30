var Sequelize = require('sequelize');
var sequelize = new Sequelize('database',null,null,{
	dialect:'sqlite',
	storage:'./db/mydb.sqlite'
});

//sequelize
//.authenticate()
//.then(function(err){
//	console.log("connecting",err);
//})
//.catch(function(err){
//	console.log("Unable to connect",err);
//});;



var User = sequelize.define('User',{
	name : Sequelize.STRING,
	password : Sequelize.STRING,
	mysalt : Sequelize.STRING,
	createdAt : Sequelize.DATE,
	updatedAt : Sequelize.DATE
});

var username = "Dave";
  User.findOne({'name':username},function(err,user){
		console.log("hhhh",user);
      if(err) {
        console.log("some",err)
  //      return done(err);
      }
      if(!user) {
        console.log("no");
    //    return done(null,false,req.flash('loginMessage', 'No user found.'));
      }
      cosnole.log("here",user);
    //  return done(null,user);
  });

//module.exports = User;

function find(name) {
	User.findOne({
		where:{name:name}
	}).then(function(user){
		console.log(user.dataValues);
	});
}
find('Ben');
//
//User.findOne().then(function(user){
//	console.log(user.get('name'));
//});
//User.findAll()
//.then(function(users){
//	console.log(users);
//});

//User.sync({force:true}).then(function(){
//	return User.create({
//		name : 'Dave',
//		password : 'ppp',
//		mysalt : 'sss'
//	});
//});


