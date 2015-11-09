'use strict';

const router 		= require('express').Router();
const StrikeTeam 	= require('../../models/strikeTeam');
const Member 		= require('../../models/member');
const socketios 	= require('../../socketios');

router.get('/',function(req,res){
	StrikeTeam.find({
		$and : [
			{ caseId 	  : req.query.caseId },
			{ branch 	  : req.query.branch },
			{ isDismissed : false }
		]
	})
	.populate('members')
	.exec(function(err, st){
		if (err) {
			return err
		} else {
			res.json(st)
		};
	});
});

router.get('/total',function(req,res){
	console.log(req.query);
	StrikeTeam.find({
		$and : [
			{ caseId : req.query.caseId},
			{ isDismissed : false}
		]
	})
	.populate('members')
	.exec(function(err, sts){
		if (err) {
			return err
		} else {
			res.json(sts)
		}
	});
});

router.get('/count',function(req,res){
	StrikeTeam.find({
		$and : [
			{ caseId   : req.query.caseId },
			{ isDismissed   : false  }
		]
	})
	.count()
	.exec(function(err, total){
		if (err) { 
			return  err
		}else{
			res.json(total)
		}
	})	
});

module.exports = router