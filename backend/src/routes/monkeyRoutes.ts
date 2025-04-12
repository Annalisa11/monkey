const express = require('express');
const monkeyController = require('../controllers/monkeyController');

const router = express.Router();

router.get('/', monkeyController.getAllMonkeys);

module.exports = router;
