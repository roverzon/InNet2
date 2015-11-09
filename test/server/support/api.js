const express = require('express');
const request = require('supertest');
const router  = require('../../../controllers');
const app = express()
	
app.use(router);
	
module.exports = request(app);