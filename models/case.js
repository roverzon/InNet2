/* 
* @Author: roverzon
* @Date:   2015-05-05 09:20:55
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-14 16:09:28
*/
'use strict';
const db 	 	 = require('../config/database');
const Schema	 = db.Schema;
const CaseSchema = new Schema({
		caseId   		: { type 	: Number,   default : 0 },
		officerReceiver : { type 	: String,	required : true },
		type      		: { type 	: String, 	required : true, default : "火警" },
		types 			: [ { type    : String} ],
		phone     		: { type 	: String },
		branches  		: [ { type 	: String} ],
		branchIds 		: [ { type 	: Schema.Types.ObjectId, ref: 'Branch'}],
		cars      		: [ { type 	: Schema.Types.ObjectId, ref: 'Car'} ],
		ntf 			: { type : Schema.Types.ObjectId, ref: 'Notification'},
		isOngoing 		: { type 	: Boolean, 	default : true },
		acceptances 	: [ { type : String }],
		corps 	  		: { type 	: String },
		floor			: { type 	: Number, default : 0 },
		env 			: { type 	: String, default : "住宅火警" },
		envs 			: [ { type : String } ],
		battleRadiuss   : [ { type : String }],
		createAt 	  	: { type 	: String },
		lastUpdate		: { type 	: String },
		updateCount     : { type 	: Number },
		endAt 			: { type 	: String },
		location 		: {
			lat 	: { type : Number },
			lng 	: { type : Number },
			address : { type : String, required : true, default : "測試" }
		}
	});

module.exports = db.model('Case',CaseSchema)