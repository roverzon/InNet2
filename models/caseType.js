'use strict';

const db 			 = require('../config/database');
const Schema  		 = db.Schema;
const CaseTypeSchema = new Schema({
	id : { type : Number, required : true},
	type : { type : String, required : true }
});

module.exports = db.model('CaseType',CaseTypeSchema);