'use strict';

const express 	= require('express');
const morgan  	= require('morgan');
const port 		= process.env.PORT || 3000; 
const app 		= express(); 


app.use(morgan('dev'));
app.use(require('./controllers'));

const server = app.listen(port,() =>{
	console.log("Server is listening on " + port);
});

require('./socketios').connect(server);

