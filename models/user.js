/* 
* @Author: roverzon
* @Date:   2015-05-05 19:25:06
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-07 18:15:53
*/

'use strict';

const db 		 = require('../config/database');
const Schema	 = db.Schema;
const UserSchema = Schema({
	username 	: { type : String, 	required : true },
	account  	: { type : String, 	required : true },
	password 	: { type : String, 	required : true },
	branch	 	: { type : String, 	required : true },
	radioCode 	: { type : String },
	corps 		: { type : String, 	required : true, default : "第一救災救護大隊" },
	role 		: { type : String, 	required : true, default : "user" },
	online 		: { type : Boolean, required : true, default : false },
	accessLevel : { type : Number, 	required : true, default : 1 },
	caseId 		: { type : String },
});

module.exports = db.model('User',UserSchema);