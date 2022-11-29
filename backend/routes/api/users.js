// backend/routes/api/users.js
const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check("email")
    .isEmail()
    .withMessage("Invalid email"),
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Email is required"),
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Username is required"),
    check("username")
    .isLength({ min: 4 })
    .withMessage("Username must be at least 4 characters"),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("First Name is required"),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Last Name is required"),
  handleValidationErrors,
];

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;

      const usernameCheck = await User.findOne({
        where: {
          username: username }
        });
      const emailCheck = await User.findOne({
        where: {
          email: email }
        });
       if(emailCheck){
        res.statusCode = 403
         return res.json({
           message: "User already exists",
           statusCode: 403,
           errors: [
             "User with that email already exists"
           ]
         })
       }else if(usernameCheck){
        res.statusCode = 403
        res.json({
          message: "User already exists",
          statusCode: 403,
          errors: [
            "User with that username already exists"
          ]
        })
       }


      const user = await User.signup({ email, username, password, firstName, lastName });
      await setTokenCookie(res, user);


      let token = await setTokenCookie(res, user);


      return res.json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          token: token
        }
      });
    }
  );




module.exports = router;
