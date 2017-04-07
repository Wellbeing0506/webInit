var Sequelize = require('sequelize');
var sequelize = new Sequelize('database',null,null,{
	dialect:'sqlite',
	storage:'../db/mydb.sqlite'
});

function find(id) {
	sequelize
		.query("select * from t1 where id=\'"+id+"\';").spread(function(result,meta){
			console.log(result,meta);		
	});
}

