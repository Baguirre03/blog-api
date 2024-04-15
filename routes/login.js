const express = require('express');

const router = express.Router();
const loginController = require('../controllers/loginController.js');
const verify = require('../jwt/verify.js');

router.get('/', verify, loginController.login_get);
router.post('/', loginController.login_post);

module.exports = router;
