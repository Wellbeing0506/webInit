var Sequelize = require('sequelize');
var sequelize = new Sequelize('database',null,null,{
  dialect:'sqlite',
  storage:'./db/mydb.sqlite'
});

var TEST = sequelize.define('t1',{
  uid : Sequelize.STRING,
  ename : Sequelize.STRING,
  name : Sequelize.STRING,
  createdTime : Sequelize.DATE,
  modifiedTime : Sequelize.DATE,
});

module.exports = TEST;

