'use strict';

const router 		= require('express').Router();
const StrikeTeam 	= require('../../models/strikeTeam');
const Member 		= require('../../models/member');
const socketios 	= require('../../socketios');

router.get('/',(req,res) => {
	StrikeTeam.find({
		$and : [
			{ caseId 	  : req.query.caseId },
			{ branch 	  : req.query.branch },
			{ isDismissed : false }
		]
	})
	.populate('members')
	.exec((err, st) => {
		if (err) {
			return err
		} else {
			return res.json(st);
		};
	});
});

router.get('/total',(req,res) => {
	
	StrikeTeam.find({
		$and : [
			{ caseId : req.query.caseId},
			{ isDismissed : false}
		]
	})
	.populate('members')
	.exec((err, sts) => {
		if (err) {
			return err
		} else {
			return res.json(sts);
		}
	});
});

router.get('/count',(req,res) => {
	StrikeTeam.find({
		$and : [
			{ caseId   : req.query.caseId },
			{ isDismissed   : false  }
		]
	})
	.count()
	.exec((err, total) => {
		if (err) { 
			return  err
		}else{
			return res.json(total);
		}
	})	
});

module.exports = router;