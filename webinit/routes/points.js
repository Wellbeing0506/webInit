var express = require('express');
var router = express.Router();
var passport = require('passport');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('database',null,null,{
  dialect:'sqlite',
  storage:'./db/mydb.sqlite'
});
router.use(function(req,res,next){
	console.log("access",Date.now());
	next();
});

router.get('/:id',function(req,res){
	console.log(req.params.id);
	sequelize.query("select * from t1 where id=\'1\';").spread(function(result,meta){	
		res.json({message:"okok"+result[0].uid+" "+JSON.stringify(result[0])});
	});
});

router.get('/:start/:end',function(req,res){
	console.log(req.params.start, req.params.end);
	sequelize.query("select * from t1 where createdTime between \""+req.params.start+"\" and \""+req.params.end+"\";").spread(function(results,meta){	
		console.log(meta);
//		res.json({message:JSON.stringify(results)});
		res.json(results);
	});
});

router.post('/post',function(req,res){
	res.setHeader('Access-Control-Allow-Origin','*');
	sequelize.query("insert into t1 (ename, name) values(\'"+req.body.ename+"\',\'"+req.body.name+"\');")
	.then(function(a,b){
		console.log(a,b);
	});
	console.log(req.body);	
	res.send(req.body);
});

module.exports = router;
