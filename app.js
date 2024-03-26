/* eslint-disable import/no-extraneous-dependencies */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MongoDB);
}

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);

app.get('/api', (req, res) => {
  res.json({
    message: 'welcome to the API',
  });
});

app.post('/api/posts', verifyToken, (req, res) => {
  console.log(req.body.username, req.body.password);

  jwt.verify(req.token, process.env.key, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created...',
        authData,
      });
    }
  });
});

app.post('/api/login', (req, res) => {
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

// FORMAT OF TOKEN
// Authorization: Bearer <acces_token>

// Verify Token
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

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
