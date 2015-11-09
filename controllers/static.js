/* 
* @Author: roverzon
* @Date:   2015-04-18 16:01:34
* @Last Modified by:   roverzon
* @Last Modified time: 2015-04-21 19:31:58
*/
'use strict';

const express 	= require('express');
const path 		= require('path');
const router 	= express.Router();

router.use(express.static( path.join(__dirname , '/../public')) );
router.use(express.static( path.join(__dirname , '/../bower_components')) );
router.use(express.static( path.join(__dirname , '/../views')));
router.use(express.static( path.join(__dirname , '/../assets')));

router.get('/',(req,res) => {
	res.sendfile( path.join( __dirname , '../layout/index.html'));
});

module.exports = router;