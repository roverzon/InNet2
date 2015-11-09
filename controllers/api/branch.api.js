'use strict';

const router   		= require('express').Router();
const Branch   		= require('../../models/branch');
const Member  		= require('../../models/member');
const StrikeTeam  	= require('../../models/strikeTeam');
const async			= require('async');
const socketios 	= require('../../socketios');

router.post('/',(req,res) => {
	let branch = new Branch({
		name  		: req.body.name,
		corps 		: req.body.corps,
		pos 		: {
			address : req.body.pos.address,
			lat 	: req.body.pos.lat,
			lng 	: req.body.pos.lng
		}
	});

	branch.save((err,branch) => {
		if (err){
			return err;
		} else {
			return res.json(branch);
		};
	});
});

router.get('/', (req,res) => {
	if (req.query.corps) {
		Branch.find({
			corps : req.query.corps
		})
		.sort({ id : 1 })
		.exec((err,branches) => {
			if (err) {
				return err
			} else {
				return res.status(200).json(branches);
			}; 
		});
	} else if (req.query.branch) {
		Branch.findOne({
			name : req.query.branch
		})
		.sort({ id : 1})
		.populate('members')
		.exec((err,branch) => {
			if (err) { return err };
			return res.status(200).json(branch)
		});
	} else { 
		Branch.find({})
	 	.sort({ id : 1 })
	 	.exec((err,branches) => {
	 		if (err) { 
	 			return err;
	 		} else {
	 			return res.status(200).json(branches)
	 		};
	 	});
	};
 });

router.post('/onduty',(req,res) =>{
	let branches = [];
	async.waterfall([
    	(cb) => {
    		let branches = []; 
    		req.body.forEach((branch,i) => {
				Branch.findOne({
					name : branch
				})
				.exec((err,branch) => {
					Member.populate(branch,
							{path : "members", match : { onDuty : true }},(err, _branch) => {
								if (err) {
									return err;
								} else {
									branches.push(_branch);
									if (i == req.body.length -1) {
										return cb('null',branches);
									};
								};
						});
				});
			});
		}
	],(err,result) => {
		if (result) {
			return res.json(result);
		};
		if (err) { return err };
	});
});

router.get('/:branchId',(req,res) => {
	if (req.query.onDuty) {
		Branch.findOne({
			id : req.params.branchId
		})
		.exec((err,details) => {
			Member.populate(details,
				{path : "members", match : {onDuty : true }},(err, _branch) => {
					if (err) {
						return err;
					} else {
						return res.status(200).json(_branch);
					};
			});
		});
	} else {
		Branch.findOne({
			id : req.params.branchId
		})
		.populate('members')
		.exec((err,details) => {
			if (err) {
				return err;
			} else {
				return res.json(details);
			};
		});
	}
});

router.put('/:branch',(req,res) => {
	Branch.findOneAndUpdate({
		name : req.params.branch
	},
	{ 
		$set : {
			members 	: req.body.members,
			director 	: req.body.director,
			directors 	: req.body.directors,
			safetyManager : req.body.safetyManager
		}
	},(err) => {
		if (err) {
			return err;
		}else{
			return res.send(200)
		}
	});
});

router.put('/',(req,res) => {
	Branch.findOneAndUpdate({
		name : req.query.branch
	},
	{
		$set : {
			director 	: req.body.director,
			dispatchNum : req.body.dispatchNum,
			safetyManager : req.body.safetyManager
		}
	},(err) => {
		if (err) {
			return err;
		} else {
			req.body.members.forEach((member) => {
				Member.findOneAndUpdate({
					_id : member._id
				},{
					$set : {
						onDuty 	: member.onDuty,
						mission : member.mission,
						group  	: member.group,
						groupId : member.groupId,
						isChecked : member.isChecked 
					}
				},(err) => {
					if (err) {return err}
				})
			});
			return  socketios.broadcast('onDutyUpdate',{ isUpated : true});
		};
	});
});

module.exports = router;