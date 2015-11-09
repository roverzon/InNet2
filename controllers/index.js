'use strict';

const router 	 = require('express').Router();
const morgan  	 = require('morgan');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use(require('./static'));
router.use('/api/users',   		require('./api/users.api'));

router.use(require('../auth'));
router.use('/api/cases',		require('./api/cases.api'));
router.use('/api/taskforces',   require('./api/taskForces.api'));
router.use('/api/members', 		require('./api/members.api'));
router.use('/api/cars', 		require('./api/cars.api'));
router.use('/api/branches', 	require('./api/branch.api'));
router.use('/api/strikeTeams', 	require('./api/strikeTeams.api'));
router.use('/api/nfts', 		require('./api/notifications.api'));
router.use('/api/geolocations', require('./api/geolocations.api'));

module.exports = router;
