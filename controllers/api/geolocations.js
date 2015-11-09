'use strict';

const router   	  = require('express').Router();
const Geolocation = require('../../models/geoLocation');

router.post('/',function(req,res){
	var geoLocation = new Geolocation({
		id 		: req.body.id,
		corps   : req.body.corps,
		branch  : req.body.branch,
		lat     : req.body.lat,
		lng     : req.body.lng,
		address : req.body.address
	})
	geoLocation.save(function(err,geos){
		if (err) { return err };
		res.status(200).json(geos);
	});
})

router.get('/',function(req,res){
	if (req.query.corps) {
		Geolocation.find({
			corps : req.query.corps
		}).exec(function(err,geos){
			res.status(200).json(geos)
		})
	} else {
		Geolocation
		.find({})
		.exec(function(err,geos){
			if (err) { return err };
			res.status(200).json(geos)
		});
	};
});
module.exports = router;