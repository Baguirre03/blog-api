const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({ message: 'welcome to my api!' });
});

module.exports = router;
