const express = require('express');

const router = express.Router();
const loginController = require('../controllers/loginController.js');
const verify = require('../jwt/verify.js');

router.get('/', loginController.login_get);
router.post('/', loginController.login_post);
router.post('/test', verify, loginController.test);

module.exports = router;
