const express = require('express');

const router = express.Router();
const postsController = require('../controllers/postsController.js');
const verify = require('../jwt/verify.js');
