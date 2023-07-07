///  file will hold the resources for the route paths beginning with /api/session
/// 1- Create and export an Express router from this file
const express = require('express')
const { Op } = require('sequelize'); // operators, provides a collection of symbolic operators that can be used in queries and conditions
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

/// import check handleValidationError ////////////////////////

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//////////////////////////////////////

const router = express.Router();


///  validateLogin that will check username/email and password keys and validate them  ////////////////////////////////////

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true }) // these are express validators
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];





// Log in ///////////////////////////////////////////////////////////////////
router.post(
  '/',
  validateLogin, /// added this from above 
  async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential
        }
      }
    });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = { credential: 'The provided credentials were invalid.' };
      return next(err);
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);
/// log out  /////////////////////////////////////////////////

router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );


// Restore session user ////////////////////////////////////
router.get(
    '/',
    (req, res) => {
      const { user } = req;

      if (user) {
        const safeUser = {
          id: user.id,
          email: user.email,
          username: user.username,
        };
        return res.json({
          user: safeUser
        });
      } else return res.json({ user: null });
    }
  );

  // ...











module.exports = router;
