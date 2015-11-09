/* 
* @Author: roverzon
* @Date:   2015-05-05 09:20:27
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-14 16:10:28
*/

'use strict';

const router = require('express').Router();
const Car 	 = require('../../models/car');

router.post('/',(req,res) => {
	let car = new Car({
		type 		: req.body.type,  
		corps 		: req.body.corps,
		branch 		: req.body.branch, 
		radioCode 	: req.body.radioCode,
		code 		: req.body.code,
		functions 	: req.body.functions
	});

	car.save((err,car) => {
		if (err) {
			return err
		} else {
			return res.status(200).json(car);
		};
	});
})

router.get('/',(req,res) => {
	if (req.query.corps) {
		Car.find({
			corps : req.query.corps
		})
		.sort({ id : 1 })
		.exec((err, cars) => {
			if (err) {
				return err
			} else {
				return res.json(cars);
			};
		});
	} else if (req.query.branch) {
		Car.find({
			branch : req.query.branch
		})
		.sort({id : 1 })
		.exec((err,cars) => {
			if (err) {
				return err
			} else {
				return res.json(cars)
			};
		})
	} else if (req.query.onDuty){

		Car.find({
			onDuty : req.query.onDuty
		})
		.sort({id : 1 })
		.exec((err,cars) => {
			if (err) {
				return err;
			} else {
				return res.json(cars);
			};
		});

	} else {
		Car.find({})
		.sort({ id : 1 })
		.exec((err,cars) => {
			if (err) {
				return err
			} else {
				return res.json(cars)
			}
		})
	};
});

router.put('/:id',(req,res) => {
	Car.findOneAndUpdate({
		_id : req.params.id
	},
	{ 
		$set : {
			isChecked : req.body.isChecked 
		}
	},
	(err) => {
		if (err) {
			return err
		} else {
			return res.status(200).json({ result  : " modified"});
		};
	});
});

module.exports = router