const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/user.js");

exports.signup_post = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom(async (value, { req, loc, path }) => {
      const user = await User.findOne({
        username: req.body.username.toLowerCase(),
      });
      if (user) {
        throw new Error("Username is taken!");
      } else {
        return value;
      }
    }),
  body("password").trim().isLength({ min: 1 }).escape(),
  body("description").trim().isLength({ min: 1, max: 50 }).escape(),
  body("confirm_password")
    .trim()
    .isLength({ min: 1 })
    .custom((value, { req, loc, path }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    let msg = {
      errors: [],
    };
    if (!errors.isEmpty()) {
      errors.errors.forEach((err) => msg.errors.push(err.msg));
      res.status(404).json(msg);
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        try {
          const user = new User({
            username: req.body.username.toLowerCase(),
            password: hashedPassword,
            description: req.body.description,
            membership: false,
          });
          await user.save();
          return res.json(msg);
        } catch (err) {
          return res.status(404).json(msg);
        }
      });
    }
  }),
];
