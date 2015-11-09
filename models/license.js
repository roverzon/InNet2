'use strict';

const db 	 		= require('../config/database');
const Schema 		= db.Schema;
const licenseSchema = Schema({
		license_number 	: { type : String},
	    id 				: { type : String},
	  	name			: { type : String},
	  	license			: { type : String},
	    licensing_unit 	: { type : String}
	});

module.exports = db.model('License',licenseSchema);