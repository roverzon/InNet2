'use strict';

const router 		= require('express').Router();
const TaskForce 	= require('../../models/taskForce');
const Member    	= require('../../models/member');

router.post('/',(req,res) => {

		let new_taskForce = new TaskForce({
			id 				: req.body.id,
			caseId 			: req.body.caseId,
			position    	: req.body.position,
			task 			: req.body.task,
			members 		: req.body.members,
			branches		: req.body.branches,
			isDismissed 	: req.body.isDismissed
		});

		new_taskForce.save((err) => {
			if (err) {return err};
			return res.json(201,"Task Force created");
		});
	})

router.get('/',(req,res) => {

		TaskForce.find()
		.populate('members')
		.exec((err, taskForces) => {

			if (err) {return err};
			return res.json(taskForces)
		});
	})

router.get('/:caseId',(req,res) => {

		TaskForce.find({
			$and : [
				{caseId : req.params.caseId},
				{isDismissed : false}
			]
		})
		.populate('members')
		.exec((err,taskForces) => {
			if (err) {return err};
			return res.json(taskForces)
		});
		
	})

router.get('/:caseId/:branchName',(req,res) => {
		TaskForce.find({
			$and : [
				{ branches : req.params.branchName},
				{ caseId   : req.params.caseId }
			]
		})
		.populate('members')
		.exec((err, total) => {
			if (err) {throw err};
			return res.json(total)
		})
		
	})

router.get('/:caseId/:branchName/count',(req,res) => {
		TaskForce.find({
			$and : [
				{ branches : req.params.branchName},
				{ caseId   : req.params.caseId },
				{ isDismissed   : false  }
			]
		})
		.count()
		.exec((err, total) => {
			if (err) {throw err};
			return res.json(total)
		})
		
	})

router.get('/:caseId/:position/count',(req,res) => {
		TaskForce.find({
			$and : [
				{ position : req.params.position},
				{ caseId   : req.params.caseId },
				{ isDismissed   : false  }
			]
		})
		.count()
		.exec((err, total) => {
			if (err) {throw err};
			return res.json(total)
		})
		
	})

router.get('/findById/:taskForceId',(req,res) => {
		TaskForce.find({
			_id : req.params.taskForceId
		})
		.populate('members')
		.exec((err, taskForce) => {
			if (err) {throw err};
			return res.json(taskForce)
		})
		
	})

router.put('/findById/:taskForceId',(req,res) => {
		TaskForce.update({
			_id : req.params.taskForceId
		},
		{ 
			position    	: req.body.position,
			task 			: req.body.task,
			members 		: req.body.members,
			branches		: req.body.branches,
			isDismissed		: req.body.isDismissed
		},
		(err) => {
			if (err) {return err};
			return res.json("modified")
		});
	});

module.exports = router