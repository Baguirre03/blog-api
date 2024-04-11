const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.login_get = asyncHandler(async (req, res, next) => {
  res.json('jhi');
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

  jwt.sign({ user }, process.env.key, (err, token) => {
    res.json({
      token,
    });
  });
});
