/* 
* @Author: roverzon
* @Date:   2015-05-05 09:20:27
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-14 16:10:28
*/

var router 	= require('express').Router(),
	License = require('../../models/license');

router
	// .post('/',function(req,res){
		
	// 	var new_case = new Case({
	// 		case_id 		: req.body.case_id,
	// 		address 		: req.body.address,
	// 		officerReceiver : req.body.officerReceiver, 
	// 		type    		: req.body.type,
	// 		phone   		: req.body.phone,
	// 		branchs 		: req.body.branchs,
	// 		ongoing 		: req.body.ongoing
	// 	});

	// 	new_case.save(function(err){
	// 		if (err) {return err;};
	// 		res.json("Case created");
	// 	});
	// })

router.get('/',function(req,res){
	License.find()
	.sort('-date')
	.exec(function(err, licenses){
		if (err) {return err};
		res.json(licenses);
	});
})

router.get('/:name',function(req,res){
	License.find({
		name : req.params.name
	},function(err, licenses){
		if (err) {return err};
		res.json(licenses)
	});
})

	// .put('/:caseId',function(req,res){

	// 	Case.findById({
	// 		_id : req.params.caseId
	// 	},function(err,old_case){
	// 		if (err) {return err};

	// 		old_case.name  = req.body.name;

	// 		old_case.save(function(err){
	// 			if (err) {return err};
	// 			res.json("Case modified");
	// 		});
	// 	});
	// })

	// .delete('/:caseId',function(req,res){
	// 	Case.remove({
	// 		_id : req.params.caseId
	// 	}, function(err){
	// 		if (err) {return err};
	// 		res.json("Case deleted")
	// 	})
	// })

module.exports = router