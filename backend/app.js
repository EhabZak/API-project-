
/// imports //////////////////////////////////////////

const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production';

/// 4-Add the routes to the Express application
const routes = require('./routes');

/// 8-  import the ValidationError class from the sequelize module.

const { ValidationError } = require('sequelize');

/// 1-create and instance of express and parse json///////////////////////////

const app = express()  // create an instance (obj) of the express.js framework

app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.json());



// 2-Security Middleware ///////////////////////////////////

if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

// 3-Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

/// 5-connecting the exported router to app after all the middlewares

app.use(routes);



// 7- first error handler Resource Not Found Error-Handler

app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);

});

/// 9- second error handler Sequelize Error-Handler

app.use((err, _req, _res, next) => {

  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors;
  }
  next(err);
})
/// 10- Error Formatter Error-Handler

app.use((err, _req, res, _res) => {

  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack

  });

});


//6- Finally, at the bottom of the app.js file, export app

module.exports = app;
