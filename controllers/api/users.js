/* 
* @Author: roverzon
* @Date:   2015-05-05 11:45:56
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-09 10:16:24
*/

'use strict';

const router  = require('express').Router();
const jwt 	  = require('jsonwebtoken');
const bcrypt  = require('bcrypt');
const User    = require('../../models/user');
const config  = require('../../config/config');

router.post('/',(req,res,next) => {
	User.findOne({
		username : req.body.name
	},(err,user) => {
		if (!user) {
			let user = new User({
				username 	: req.body.name,
				account  	: req.body.account,
				branch	 	: req.body.branch,
				corps 	 	: req.body.corps,
				radioCode 	: req.body.radioCode
			})
			bcrypt.hash(req.body.password, 10, (err,hash) => {
				if (err) {
					return err 
				} else { 
					user.password = hash
					user.save((err) => {
						if (err) {
							return err;
						} else {
							return res.send(201);
						};
					}); 
				};
			});
		} else {
			return res.json(403,"user already exist");
		};
	});
});

router.get('/',(req,res,next) => {
	if (!req.headers['x-auth']) {
		return res.send(401)
	}
	let auth = jwt.decode(req.headers['x-auth'], config.secret)
	User.findOne({username:auth.username},(err,user) => {
		if (err) {
			return  err; 
		} else {
			return res.json(user);
		}; 
	});
});

router.get('/userState',(req,res) => {
	User.find({
		online : true
	},
	(err,users) => {
		if (err) {
			return err;
		} else {
			return res.json(users);
		};
	})
})

router.post('/authenticate', (req,res) => {
	User.findOne({
		account : req.body.account
	},(err,user) => {
		if (err) { 
			return err;
		} else {
			if (!user) {
				res.json({ success : false, message : "Authenticate failed ! User not found"})
			} else if (user){
				bcrypt.compare(req.body.password, user.password, (err,valid) => {
					if (err) {
						throw err;
						return res.send(401);
					} else {
						if (valid) {
							let token = jwt.sign(user,config.secret,{
								expiresInMinutes:1440
							});
							return res.json({
								username : req.body.username,
								success : true,
								token :token 
							});
						} else {
							return res.json(401,{success : false, message : "Authenticate failed ! Wrong password"})
						};
					}
				});
			};
		};
	})
});

router.delete('/delete',(req,res) => {
	User.findOneAndRemove({
		username : req.query.username
	},(err) => {
		if (err) {
			return err;
		} else { 
			return res.json(200,{ username : req.query.username});
		};
	});
});

module.exports = router
