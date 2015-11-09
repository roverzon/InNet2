'use strict';

const db 				= require('../config/database');
const Schema 			= db.Schema;
const StrikeTeamSchema 	= Schema({
	id 				: { type : Number},
	caseId 			: { type : String},
	branch			: { type : String, required : true },
	director 		: { type : String, required : true },
	position    	: { type : String, required : true },
	positions 		: [ { type : String } ], 
	group 	 		: { type : String, required : true },
	groups 			: [ { type : String } ],
	area 			: { type : String, required : true },
	areas 			: [ { type : String } ],
	floor 			: { type : Number, required : true },
	floors 			: [ { type : Number } ],
	members 		: [ { type: Schema.Types.ObjectId , ref: 'Member' } ],
	isDismissed		: { type : Boolean, default : false },
	workingTime 	: { type : Number,  default : 12000 },
	state			: { type : String },
	progress 		: { type : Number },
	creator 		: { type : String,	required : true },
	timerRunning 	: { type : Boolean, default : false },
	createAt 		: { type : Date, default : Date.now }, 
	lastUpdate 		: { type : Date, default : Date.now },
	endAt 			: { type : Date, default : Date.now },
	currentUser 	: { type : String }
});

module.exports = db.model('StrikeTeam',StrikeTeamSchema);