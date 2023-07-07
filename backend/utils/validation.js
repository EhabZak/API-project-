
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req); //this is an object

  if (!validationErrors.isEmpty()) {
    const errors = {};

    validationErrors
      .array()  //to get an array of individual errors.
      .forEach(error => errors[error.path] = error.msg); //For each error, the code assigns the error message (error.msg) to the errors object using the field or path as the key (error.path).

    const err = Error("Bad request."); //an err object is created as an instance of the Error class, with the error message set to "Bad request." 
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

module.exports = {
  handleValidationErrors
};
