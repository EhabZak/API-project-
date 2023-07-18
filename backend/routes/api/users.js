/// file will hold the resources for the route paths beginning with /api/users
/// 1- Create and export an Express router from this file

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');



const router = express.Router();

/// will check name/email and password keys and validate them //////////////

const validateSignup = [

  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
////////////////////////////////////
    check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.')
    .isLength({ max: 30 })
    .withMessage('Username must not exceed 30 characters.'),
    // .custom(async (value) => {
    //   const existingUser = await User.findOne({ username: value });
    //   if (existingUser) {
    //     return Promise.reject('Username already exists. Please choose a different username.');
    //   }
    //   return true;
    // }),
////////////////////////////////////
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
///////////////////////
    check('firstName')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a first name with at least 4 characters.')
    .isLength({ max: 30 })
    .withMessage('first name must not exceed 30 characters.')
    .not()
    .isEmail()
    .withMessage('First name cannot be an email.'),
/////////////////////////////
    check('lastName')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a last name with at least 4 characters.')
    .isLength({ max: 30 })
    .withMessage('Last name must not exceed 30 characters.')
    .not()
    .isEmail()
    .withMessage('Last name cannot be an email.'),
  handleValidationErrors,
];


// Sign up //////////////////////////
router.post(
  '',
  validateSignup,
  async (req, res) => {
    const { email, password, username,firstName,lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ email,firstName,lastName, username, hashedPassword });

    const safeUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);
//////////////////////////////////////////////////////////////










module.exports = router;
