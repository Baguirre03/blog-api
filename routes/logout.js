const express = require('express');

const router = express.Router();
const logoutController = require('../controllers/logoutController.js');
const verify = require('../jwt/verify.js');
