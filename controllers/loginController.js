const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

exports.login_get = asyncHandler(async (req, res, next) => {
  res.json('jhi');
});

exports.test = asyncHandler(async (req, res, next) => {
  res.json('test');
});

exports.login_post = asyncHandler(async (req, res, next) => {
  const userName = req;
  console.log(userName);
  // Mock User
  // Usually this is a request to login, s
  // ending username and pass, auth here with database
  // Skipping currently to getting user back
  const user = {
    id: 3,
    username: 'Brad',
    email: 'brad@gmail.com',
  };

  jwt.sign({ user }, process.env.key, (err, token) => {
    res.json({
      token,
    });
  });
});
