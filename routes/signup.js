const express = require('express');

const router = express.Router();
const verify = require('../jwt/verify.js');
const signupController = require('../controllers/signupController.js');

router.post('/', signupController.signup_post);

module.exports = router;
