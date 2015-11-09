'use strict';
const db 			= require('../config/database');
const Schema   		= db.Schema;
const PosTypeSchema = new Schema({
		id 			: { type : Number, required : true },
		position 	: { type : String, required : true }
	});
	
module.exports = db.model('PosType',PosTypeSchema);