'use strict';

const 	express = require('express');
const	path 	= require('path');
const	router 	= express.Router();

router.use(express.static(path.join(__dirname,'../public')));
router.use(express.static(path.join(__dirname,'../bower_components/')));
router.use(express.static(path.join(__dirname,'../assets/')));
router.use(express.static(path.join(__dirname,'../views')));
router.get('/',function(req,res){
	res.sendFile(path.join(__dirname,'../layout/index.html'));
});

module.exports = router;