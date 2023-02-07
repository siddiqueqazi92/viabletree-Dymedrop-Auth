/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const passport = require("passport");
const Validator = require("validatorjs");
module.exports = {
  // Login
  // login: function (req, res) {
  //   passport.authenticate("local", { session: false }, (err, user, info) => {
  //     if (err || !user) {
  //       sails.log.error(err);
  //       return res.send({
  //         status: false,
  //         message: info.message,
  //         data: [],
  //       });
  //     }

  //     req.logIn(user, (err) => {
  //       if (err) {
  //         sails.log.error(err);
  //         res.send({
  //           status: false,
  //           message: err,
  //           data: [],
  //         });
  //       }
  //       sails.log("User " + user.id + " has logged in.");
  //       res.send({
  //         status: true,
  //         message: "User logged in successfully",
  //         data: user,
  //       });
  //     });
  //   })(req, res);
  // },

  // Logout
  logout: function (req, res) {
    req.logout();
    res.send({ status: true, message: "Logged out successfully", data: [] });
  },

  // Register
  // register: function (req, res) {
  //   sails.log("Action AuthController.register started");
  //   //TODO: form validations here

  //   const rules = {
  //     name: "required",
  //     image: "required",
  //     email: "required|email",
  //     password: "required",
  //   };

  //   let validation = new Validator(req.body, rules);

  //   if (validation.passes()) {
  //     //TODO: check if user is already exists
  //     // Checking it on lifecycle method
  //     data = {
  //       image: req.body.image,
  //       email: req.body.email,
  //       name: req.body.name,
  //       password: req.body.password,
  //       // phone: req.body.phone,
  //     };
  //     User.create(data)
  //       .fetch()
  //       .exec((err, user) => {
  //         if (err) {
  //           return res.badRequest({
  //             status: false,
  //             message: err.message,
  //             data: [],
  //           });
  //         }

  //         //TODO: send email/otp confirmation before login
  //         sails.log("Action AuthController.register ended");
  //         req.login(user, (err) => {
  //           if (err) {
  //             return res.badRequest(err);
  //           }
  //           sails.log("User " + user.id + " has logged in");
  //           return res.send({
  //             status: true,
  //             message: "Logged in successfully",
  //             data: user,
  //           });
  //         });
  //       });
  //   }
  //   // validation.fails(); // false
  // },
};
