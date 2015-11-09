/* 
* @Author: roverzon
* @Date:   2015-05-09 20:46:23
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-09 20:52:04
*/
'use strict';

const db 			= require('../config/database');
const Schema 		= db.Schema;
const memberSchema  = Schema({
		title 			: { type : String, required : true  },
		id    			: { type : String },
		name 			: { type : String, required : true  },
		corps 			: { type : String, required : true  },
		branch 			: { type : String, required : true  },
		isChecked		: { type : Boolean, default : false },
		onDuty			: { type : Boolean, default : true  },
		level 			: { type : Number,  default : 1.3 },
		mission			: { type : String },
		missions		: [ { type : String } ],
		radioCodePrefix : { type : String },
		radioCode 		: { type : Number },
		workingTime 	: { type : Number },
		isUser 			: { type : Boolean, default : false },
		carId 			: { type: Schema.Types.ObjectId , ref: 'Car' },
		count 			: { type : Number, required : true, default : 0 },
		group 			: { type : String },
		groups 			: [ { type : String }],
		groupId 		: { type : Number }
	});

module.exports = db.model('Member',memberSchema);