'use strict';

const router   	  = require('express').Router();
const Geolocation = require('../../models/geoLocation');

router.post('/',(req,res) => {
	let geoLocation = new Geolocation({
		id 		: req.body.id,
		corps   : req.body.corps,
		branch  : req.body.branch,
		lat     : req.body.lat,
		lng     : req.body.lng,
		address : req.body.address
	})
	geoLocation.save((err,geos) => {
		if (err) { return err };
		return res.status(200).json(geos);
	});
})

router.get('/',(req,res) => {
	if (req.query.corps) {
		Geolocation.find({
			corps : req.query.corps
		}).exec((err,geos) => {
			return res.status(200).json(geos)
		})
	} else {
		Geolocation
		.find({})
		.exec((err,geos) => {
			if (err) { return err };
			return res.status(200).json(geos)
		});
	};
});
module.exports = router;