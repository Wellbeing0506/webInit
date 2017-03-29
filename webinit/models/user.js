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

