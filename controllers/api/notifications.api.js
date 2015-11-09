'use strict';

const router    = require('express').Router();
const Nft  		= require('../../models/notification');

router.get('/',(req,res) => {
	Nft.find({},(err,nfts) => {
		if (err) {
			return err
		} else {
			return res.json(nfts);
		};
	});
});

module.exports = router;
