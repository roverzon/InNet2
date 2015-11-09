/* 
* @Author: roverzon
* @Date:   2015-05-05 09:20:27
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-14 16:10:28
*/
'use strict';

const router 	= require('express').Router();
const Case 		= require('../../models/case');
const Car 		= require('../../models/car');
const Member  	= require('../../models/member');
const Ntf 		= require('../../models/notification');
const socketios = require('../../socketios');

router.post('/',function(req,res){
	Case.find({})
	.count()
	.exec(function(err,total){
		var newCase = new Case({
			caseId 			: total + 1 ,
			address 		: req.body.address,
			officerReceiver : req.body.officerReceiver, 
			type    		: req.body.type,
			types			: req.body.types,
			phone   		: req.body.phone,
			branches 		: req.body.branches,
			branchIds		: req.body.branchIds,
			corps 			: req.body.corps,
			cars 			: req.body.cars,
			env 			: req.body.env,
			envs 			: req.body.envs,
			floor			: req.body.floor,
			createAt 		: req.body.createAt,
			lastUpdate		: req.body.lastUpdate,
			ntf 			: req.body.ntf, 
			location 		: {
				lat 	: req.body.location.lat,
				lng 	: req.body.location.lng,
				address : req.body.location.address
			},
			battleRadiuss   : req.body.battleRadiuss
		});

		newCase.save(function(err, newCase){
			if (err) {
				return err;
			} else {
				Car.populate(newCase,
					{ 
						path : "cars" 
					},function(err, newCase){
						if (err) {
							return err;
						} else {
							socketios.broadcast('newCase', newCase);
						};
				});
				res.send(201);
			};
		});
	})
});

router.get('/',function(req,res){

	var p = Number(req.query.page),
		itemsPerPage = Number(req.query.ipp);

	Case.count({
		corps : req.query.corps
	},function(err,totalCases){
		Case.find({
			corps : req.query.corps 
		})
		.sort({ 'caseId' : -1 })
		.where('caseId').gt( totalCases + 1  - (p * itemsPerPage  + 1) ).lt(   totalCases - ( (p - 1) * itemsPerPage ) + 1 )
		.limit(100)
		.exec(function(err, cases){
			if (err) {
				return err;
			} else {
				return res.json({cases: cases, totalCases : totalCases})
			};
		});
	})
});

router.get('/branch',function(req,res){
	if (req.query.accessLevel > 1 ) {
		Case.find({
			$and : [ { isOngoing : true} , { corps : req.query.corps } ]
		})
		.sort({'caseId':-1})
		.limit(3)
		.populate('cars')
		.populate('ntf')
		.exec(function(err,old_case){
			if (err) {
				return err
			} else {
				res.json(old_case)
			};
		});
	} else {
		Case.find({
			$and : [ { branches : { $in : [req.query.branch] } } , { isOngoing : true}, { corps : req.query.corps } ]
		})
		.sort({'caseId':-1})
		.limit(3)
		.populate('cars')
		.populate('ntf')
		.exec(function(err,old_case){
			if (err) {
				return err
			} else {
				res.json(old_case);
			};
		});
	};
});

router.get('/details/:caseId',function(req,res){
	Case.findById({
		_id : req.params.caseId
	})
	.populate('cars')
	.populate('branchIds')
	.populate('ntf')
	.exec(function(err,_case){
		if (err) {
			return err
		} else {
			Member
			.populate(_case,
				{path : "branchIds.members", match : {onDuty : true }},
				function(err, members){
					if (err) {
						return err;
					} else{
						res.json(members);
					};
			});
		};
	});
});

router.get('/details',function(req,res){
	Case.find({})
	.populate('cars')
	.exec(function(err,old_case){
		if (err) {
			return err;
		} else {
			res.json(old_case);
		};
	});
});

router.put('/close',function(req,res){
	console.log(req.body);
	Case.findOneAndUpdate({
		_id : req.query.id
	},{
		$set : {
			isOngoing 	: false,
			endAt 	  	: req.body.endAt,
			lastUpdate 	: req.body.endAt 
		}
	},function(err){
		if (err) {
			return err
		} else {
			res.send(200);
		};
	});
});

router.get('/:caseId',function(req,res){
	Case.findById({
		_id : req.params.caseId
	})
	.populate('cars','radioCode')
	.populate('ntf')
	.exec(function(err, _case){
		if (err) {
			return err
		}else{
			
			return res.json(_case)	
		}
	});
})


router.put('/:caseId',function(req,res){
	Case.findOneAndUpdate({
		_id : req.params.caseId
	},
	{ 
		$set : {
			address 		: req.body.address,
			officerReceiver : req.body.officerReceiver, 
			type    		: req.body.type,
			types			: req.body.types,
			phone   		: req.body.phone,
			branches 		: req.body.branches,
			branchIds		: req.body.branchIds,
			isOngoing 		: req.body.isOngoing,
			corps 			: req.body.corps,
			cars 			: req.body.cars,
			env 			: req.body.env,
			envs 			: req.body.envs,
			floor			: req.body.floor,
			lastUpdate		: req.body.lastUpdate,
			ntf 			: req.body.ntf
		},
		$inc  : { updateCount : 1 }	
	},
	function(err) {
		if (err) { return err };
		res.send(200);
	});
});

router.delete('/:caseId',function(req,res){
	Case.remove({
		_id : req.params.caseId
	}, function(err) {
		if (err) {
			return err
		} else {
			res.send(204);
		}
	})
});

module.exports = router;