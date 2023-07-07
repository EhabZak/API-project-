///  file will hold the resources for the route paths beginning with /api/session
/// 1- Create and export an Express router from this file
const express = require('express')
const { Op } = require('sequelize'); // operators, provides a collection of symbolic operators that can be used in queries and conditions
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');



const router = express.Router();

// Log in
router.post(
    '/',
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

















module.exports = router;
