'use strict';

const db 		= require('../config/database');
const Schema  	= db.Schema;
const CarSchema = new Schema({
	id 			: { type : Number, required : true, default : 0 },
	type 		: { type : String, required : true  },
	corps 	 	: { type : String, required : true  },
	branch 		: { type : String, required : true  },
	corps 		: { type : String, required : true  }, 
	radioCode	: { type : String, required : true  },
	code 		: { type : Number, required : true  },
	functions 	: { type : String },
	isChecked 	: { type : Boolean, default : false },
	onDuty		: { type : Boolean, default : true  },
});

module.exports = db.model('Car',CarSchema)