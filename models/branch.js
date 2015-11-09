/* 
* @Author: roverzon
* @Date:   2015-05-09 20:17:43
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-09 20:52:26
*/

'use strict';

const db 			= require('../config/database');
const Schema   		= db.Schema;
const BranchSchema 	= new Schema({
		id 				: { type : Number, default : 0},
		name  			: { type : String, required : true },
		corps 			: { type : String, required : true },
		director 		: { type : String },
		directors 		: [ { type : String } ],
		members 		: [ {  type: Schema.Types.ObjectId , ref: 'Member'}],
		dispatchNum 	: { type : Number },
		safetyManager 	: { type : String },
		cases 			: [ { type : Schema.Types.ObjectId, ref : 'Case'} ],
		location		: {
			address : { type : String },
			lat 	: { type : Number },
			lng 	: { type : Number }
		}
	});

module.exports = db.model('Branch',BranchSchema)