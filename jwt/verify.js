function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers.authorization;

  // Check if undefined
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];
    // Set token
    req.token = token;
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

module.exports = verifyToken;
