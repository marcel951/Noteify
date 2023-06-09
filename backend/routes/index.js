const express = require('express');
const router = express.Router(); 

const user = require('./user'); 
router.use('/user', user);

const home = require('./home'); 
router.use('/home', home); 
module.exports = router;