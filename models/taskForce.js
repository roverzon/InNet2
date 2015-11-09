var db = require('../config/database'),
Schema = db.Schema,
taskForceSchema = Schema({
	id 				: { type : String, required : true },
	caseId 			: { type : String, required : true },
	position    	: { type : String, required : true },
	task 			: { type : String, required : true },
	members 		: [ { type: Schema.Types.ObjectId , ref: 'Member' } ],
	branches		: { type : String },
	isDismissed		: { type : Boolean,required : true },
	timeRecord		: [ {  type: Date, default: Date.now } ]
})

module.exports = db.model('TaskForce',taskForceSchema)