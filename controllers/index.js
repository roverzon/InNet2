'use strict';
const router = require('express').Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json());

router.use(require('./static'));

module.exports = router;
