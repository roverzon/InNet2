'use strict';

const router 	= require('express').Router();
const socketios = require('../../socketios');
const Member 	= require('../../models/member');

router.post('/',(req,res) => {
	let member = new Member({
		title 			: req.body.title,  
		id    			: req.body.id,
		name 			: req.body.name,
		corps 			: req.body.corps,
		branch 			: req.body.branch,
		mission			: req.body.mission,
		missions		: req.body.missions,
		radioCode 		: req.body.radioCode,
		radioCodePrefix : req.body.radioCodePrefix,
		workingTime 	: parseInt(req.body.workingTime)
	});

	member.save((err) => {
		if (err) {
			return err
		} else {
			return res.json(201,"New Member created");
		};
	});
});

router.get('/',(req,res) => {
	Member.find()
	.sort('-date')
	.exec((err, members) => {
		if (err) {
			return err
		} else {
			return res.json(members);
		};
	});
});
	

router.get('/onDuty',(req,res) => {
 	Member.find({ $and :[
 		{branch : req.query.branch},
 		{onDuty : true }
 	]})
 	.sort({radioCode : 1})
 	.exec((err,members) => {
 		if (err) {
 			return err
 		} else {
 			return res.json(members);
 		};
 	});
 });
	
router.get('/:branchName', (req,res) => {
 	Member.find({ 
 		branch : req.params.branchName
 	})
 	.sort({radioCode : 1 })
 	.exec(( err, members) => {
 		if (err) { 
 			return err
 		} else {
 			return res.json(members);
 		};
 	}); 
 });

router.get('/findById/:memberId',(req,res) => {
	Member.find({
		_id : req.params.memberId
	},(err,member) => {
		if (err) {
			return err
		} else {
			return res.json(member);
		};
	});
});

router.put('/findById/:memberId',(req,res) => {

	Member.findOneAndUpdate({
		_id : req.params.memberId
	},
	{ 
		$set : {
			name  		: req.body.name,
			title  		: req.body.title,
			onDuty 		: req.body.onDuty,
			isChecked 	: req.body.isChecked,
			workingTime : req.body.workingTime,
			radioCode 	: req.body.radioCode,
			branch 		: req.body.branch,
			corps  		: req.body.corps
		}
	},
	(err) => {
		if (err) {
			return err;
		} else {
			return res.send(204);
		};
	});
});

router.put('/onDuty/findById',(req,res) => {
	Member.findOneAndUpdate({
		_id : req.query.memberId
	},{
		$set : {
			mission : req.body.mission,
			onDuty  : req.body.onDuty
		}
	},(err) => {
		if (err) { 
			return err 
		} else {
			return res.send(200);
		};
	});
});

router.put('/',(req,res) => {
	
	Member.findOneAndUpdate({
		_id : req.query.id
	},
	{ 
		$set : {
			isChecked : req.body.isChecked,
			mission   : req.body.mission 
		}
		
	},
	(err) => {
		if (err) {
			return err
		} else {
			return res.send(204);
		};
	});
});

router.put('/user',(req,res) => {
	Member.findOneAndUpdate({
		name : req.query.member
	},{
		$set : {
			isUser : true 
		}
	},(err) => {
		if (err) {
			return err
		} else { 
			return res.send(204);
		};
	});
});

router.put('/user/remove',(req,res) => {
	
	Member.findOneAndUpdate({
		name : req.query.username
	},{
		$set : {
			isUser : false
		}
	},(err) => {
		if (err) {
			return err;
		} else {
			return res.send(200);
		};
	});
});

router.put('/total', (req,res) => {
	Member.update({},
		{	
			isChecked : false
		},
		{
			multi : true 
		}, (err) => {
			if (err) {
				return err;
			} else {
				return res.send(200);
			};
	});
});

router.delete('/:memberId',(req,res) => {
	Member.findOneAndRemove({
		_id : req.params.memberId
	},(err) => {
		if (err) { 
			return err 
		} else {
			return res.send(204);
		};
	});
});

module.exports = router;