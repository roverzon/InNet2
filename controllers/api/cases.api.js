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

router.post('/',(req,res) => {
	Case.find({})
	.count()
	.exec((err,total) => {
		let newCase = new Case({
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

		newCase.save((err, newCase) => {
			if (err) {
				return err;
			} else {
				Car.populate(newCase,
					{ 
						path : "cars" 
					},(err, newCase) => {
						if (err) {
							return err;
						} else {
							socketios.broadcast('newCase', newCase);
						};
				});
				return res.send(201);
			};
		});
	})
});

router.get('/',(req,res) => {

	let p = Number(req.query.page),
		itemsPerPage = Number(req.query.ipp);

	Case.count({
		corps : req.query.corps
	},(err,totalCases) => {
		Case.find({
			corps : req.query.corps 
		})
		.sort({ 'caseId' : -1 })
		.where('caseId').gt( totalCases + 1  - (p * itemsPerPage  + 1) ).lt(   totalCases - ( (p - 1) * itemsPerPage ) + 1 )
		.limit(100)
		.exec((err, cases) => {
			if (err) {
				return err;
			} else {
				return res.json({cases: cases, totalCases : totalCases})
			};
		});
	})
});

router.get('/branch',(req,res) => {
	if (req.query.accessLevel > 1 ) {
		Case.find({
			$and : [ { isOngoing : true} , { corps : req.query.corps } ]
		})
		.sort({'caseId':-1})
		.limit(3)
		.populate('cars')
		.populate('ntf')
		.exec((err,old_case) => {
			if (err) {
				return err
			} else {
				return res.json(old_case)
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
		.exec((err,old_case) => {
			if (err) {
				return err
			} else {
				return res.json(old_case);
			};
		});
	};
});

router.get('/details/:caseId',(req,res) => {
	Case.findById({
		_id : req.params.caseId
	})
	.populate('cars')
	.populate('branchIds')
	.populate('ntf')
	.exec((err,_case) => {
		if (err) {
			return err
		} else {
			Member
			.populate(_case,
				{path : "branchIds.members", match : {onDuty : true }},
				(err, members) => {
					if (err) {
						return err;
					} else{
						res.json(members);
					};
			});
		};
	});
});

router.get('/details',(req,res) => {
	Case.find({})
	.populate('cars')
	.exec((err,old_case) => {
		if (err) {
			return err;
		} else {
			return res.json(old_case);
		};
	});
});

router.put('/close',(req,res) => {
	
	Case.findOneAndUpdate({
		_id : req.query.id
	},{
		$set : {
			isOngoing 	: false,
			endAt 	  	: req.body.endAt,
			lastUpdate 	: req.body.endAt 
		}
	},(err) => {
		if (err) {
			return err
		} else {
			return res.send(200);
		};
	});
});

router.get('/:caseId',(req,res) => {
	Case.findById({
		_id : req.params.caseId
	})
	.populate('cars','radioCode')
	.populate('ntf')
	.exec((err, _case) => {
		if (err) {
			return err
		} else {
			return res.json(_case)	
		}
	});
})


router.put('/:caseId',(req,res) => {
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
	(err) => {
		if (err) { return err };
		return res.send(200);
	});
});

router.delete('/:caseId',(req,res) => {
	Case.remove({
		_id : req.params.caseId
	}, (err) =>  {
		if (err) {
			return err
		} else {
			return res.send(204);
		}
	})
});

module.exports = router;