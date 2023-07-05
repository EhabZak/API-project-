
/// imports //////////////////////////////////////////

const express = require ('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const {environment} = require ('./config');
const isProduction = environment === 'production';

/// 4-Add the routes to the Express application
const routes= require('./routes');

/// 1-create and instance of express and parse json///////////////////////////

const app= express()  // create an instance (obj) of the express.js framework

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

  //6- Finally, at the bottom of the app.js file, export app

  module.exports = app;
