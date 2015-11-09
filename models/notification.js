'use strict';

const db = require('../config/database');
const Schema   = db.Schema;
const NotificationSchema = new Schema({
		env 	: { type : String, required : true },
		type 	: { type : String, required : true },
		list 	: [ { type : String, required : true } ]
	});

module.exports = db.model('Notification',NotificationSchema);