const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.login_get = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, process.env.key, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'message',
        authData,
      });
    }
  });
});

exports.login_post = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username.toLowerCase() });
  if (!user) {
    res.json('user not found');
  }
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    res.json('password incorrect');
  }

  // Returns the token, as well as the user information,
  // save this into the LS and you are set to make safe requests after this
  jwt.sign({ user }, process.env.key, (err, token) => {
    res.json({
      token,
    });
  });
});
