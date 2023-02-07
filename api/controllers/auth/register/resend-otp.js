const { generateOtp } = require("../../../util");
const moment = require("moment");
const path = require('path')
var ejs = require("ejs");

module.exports = {
  friendlyName: "Resend OTP",

  description: "Resend OTP.",

  inputs: {
    email: {
      type: "string",
      required: false,
    },
    contact: {
      type: "ref",
      required: false,
      custom: function (value) {
        return (
          _.isObject(value) &&
          !_.isUndefined(value.country_code) &&
          !_.isUndefined(value.number)
        );
      },
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    badRequest: {
      description: "Send badReques wrong messaget response",
      responseType: "badRequest",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("Action auth/register/resend-otp started with inputs: ", inputs, "\nTime: ", moment().format());

    //TODO: form validations here
    //TODO: check if user is already exists
    // Checking it on lifecycle method
    let otp = generateOtp();
    data = {
      otp: otp,
      // phone: req.body.phone,
      otp_generated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
    let where = {};
    if (inputs.contact && inputs.contact.country_code) {
      where.country_code = inputs.contact.country_code;
      where.contact = inputs.contact.number;
    }
    if (inputs.email) {
      where.email = inputs.email;
    }
    UserRequest.updateOne(where)
      .set(data)
      .exec((err, user) => {
        if (err) {
          sails.log("Error at Action auth/register/resend-otp while updating db. Error: ", err, "\nTime: ", moment().format());
          return exits.ok({
            status: false,
            message: err.message,
            data: [],
          });
        }
        delete user.password;
        //TODO: send email/otp confirmation before login
        if (inputs.email) {
          ejs.renderFile(path.join(__dirname, "..", "..", "..", "..", "views", "mails", "registerOtp.ejs"), { otp, email: inputs.email }, function (err, data) {
            if (err) {
              sails.log(`Action auth/register caught an error while views for email (.ejs). Error: ${err}
          Time: ${moment().format()}`);
              return exits.ok({
                status: false,
                message: err.message,
                data: [],
              });
            }
            else {
              const subject = `Your confirmation code is: ${otp}`
              sails.helpers.mail.mandrill.send(
                inputs.email,
                subject,
                data
              );
            }
          });
        }
        sails.log("Action auth/register/resend-otp ended succesfully with data(user): ", user, "\nTime: ", moment().format());
        return exits.success({
          status: true,
          message: "OTP sent successfully",
          data: user,
        });
      });
  },
};
