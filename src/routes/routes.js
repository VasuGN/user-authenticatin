const express = require('express');
const router = express.Router();
const userRouter = require('./user.js');

/* Route handling for user-related operations */
router.use('/user', userRouter);

module.exports = router;