'use strict';

const router = require('express').Router();
const Nft  	 = require('../../models/notification');

router.get('/',function(req,res){
	Nft.find({},function(err,nfts){
		if (err) {
			return err
		} else {
			res.json(nfts);
		};
	});
});

module.exports = router;
