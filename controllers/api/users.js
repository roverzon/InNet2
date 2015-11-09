'use strict';
/* 
* @Author: roverzon
* @Date:   2015-05-05 11:45:56
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-09 10:16:24
*/
const router  = require('express').Router();
const jwt 	  = require('jsonwebtoken');
const bcrypt  = require('bcrypt');
const User    = require('../../models/user');
const config  = require('../../config/config');

router.post('/',function(req,res,next){
	User.findOne({
		username : req.body.name
	},function(err,user){
		if (!user) {
			var user = new User({
				username 	: req.body.name,
				account  	: req.body.account,
				branch	 	: req.body.branch,
				corps 	 	: req.body.corps,
				radioCode 	: req.body.radioCode
			})
			bcrypt.hash(req.body.password, 10, function(err,hash){
				if (err) {
					return err 
				} else { 
					user.password = hash
					user.save(function(err){
						if (err) {
							return err;
						} else {
							res.send(201);
						};
					}); 
				};
			});
		} else {
			res.json(403,"user already exist");
		};
	});
});

router.get('/',function(req,res,next){
	if (!req.headers['x-auth']) {
		return res.send(401)
	}
	var auth = jwt.decode(req.headers['x-auth'], config.secret)
	User.findOne({username:auth.username},function(err,user){
		if (err) {
			return  err; 
		} else {
			res.json(user)
		}; 
	});
});

router.get('/userState',function(req,res){
	User.find({
		online : true
	},
	function(err,users){
		if (err) {
			return err;
		} else {
			res.json(users);
		};
	})
})

router.post('/authenticate', function(req,res){
	User.findOne({
		account : req.body.account
	},function(err,user){
		if (err) { 
			return err;
		} else {
			if (!user) {
				res.json({ success : false, message : "Authenticate failed ! User not found"})
			} else if (user){
				bcrypt.compare(req.body.password, user.password, function(err,valid){
					if (err) {
						return  err;
						res.send(401);
					} else {
						if (valid) {
							var token = jwt.sign(user,config.secret,{
								expiresInMinutes:1440
							});
							res.json({
								username : req.body.username,
								success : true,
								token :token 
							});
						} else {
							res.json(401,{success : false, message : "Authenticate failed ! Wrong password"})
						};
					}
				});
			};
		};
	})
});

router.delete('/delete',function(req,res){
	User.findOneAndRemove({
		username : req.query.username
	},function(err){
		if (err) {
			return err;
		} else { 
			res.json(200,{ username : req.query.username})
		};
	});
});

module.exports = router;
