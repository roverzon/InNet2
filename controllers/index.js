'use strict';

const router 	 = require('express').Router();
const morgan  	 = require('morgan');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use(require('./static'));
router.use('/api/users',   		require('./api/users'));

router.use(require('../auth'));
router.use('/api/cases',		require('./api/cases'));
router.use('/api/taskforces',   require('./api/taskForces'));
router.use('/api/members', 		require('./api/members'));
router.use('/api/cars', 		require('./api/cars'));
router.use('/api/branches', 	require('./api/branch'));
router.use('/api/strikeTeams', 	require('./api/strikeTeams'));
router.use('/api/nfts', 		require('./api/notifications'));
router.use('/api/geolocations', require('./api/geolocations'));

module.exports = router;
