const { generateOtp } = require("../../util");
const moment = require("moment");
const path = require('path')
var ejs = require("ejs");
module.exports = {
  friendlyName: "Forget password",

  description: "",

  inputs: {
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
    email: {
      type: 'string',
      required: false,
      isEmail: true
    }
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    invalid: {
      responseType: "badRequest",
      description: "Driver not exists",
    },
  },

  fn: async function ({ contact, email }, exits) {
    sails.log.debug("calling user/forget-password", { contact, email }, "\nTime: ", moment().format());
    if (!email && !contact) {
      sails.log.error("Error at auth/v1/forget-password.js with reason: '!inputs.email && !inputs.contact'\nTime: ", moment().format());
      return exits.ok({ status: false, data: [], message: "Email/contact is required" });
    }
    let where = {};
    if (contact) {
      where.country_code = contact.country_code;
      where.contact = contact.number;
    }
    if (email) {
      where.email = email;
    }

    try {
      const user = await User.findOne(where)
      let otp = null;
      if (!user) {
        sails.log.error("error calling user/forget-password REASON: 'user not found(invalid creds)'\nTime: ", moment.utc().format());
        return exits.ok({ status: false, data: [], message: "Email is invalid" });
      }
      otp = generateOtp();
      await User.updateOne({ where }).set({ otp, otp_generated_at: moment.utc().format("YYYY-MM-DD HH:mm:ss") }); //Time Stamp should be stored

      // await sails.helpers.auth.sendOtp.with({
      //   contact: contact,
      //   otp
      // });
      // Your OTP for Dymedrop is xyz
      if (email) {

        ejs.renderFile(path.join(__dirname, "..", "..", "..", "views", "mails", "forgetPasswordOtp.ejs"), { otp }, function (err, data) {
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
            const subject = `Reset your Dymedrop password`
            sails.helpers.mail.mandrill.send(
              email,
              subject,
              data
            );
          }
        });
      }
      sails.log.debug("user/forget-password executed successfully and provided OTP: ", otp, "\nTime: ", moment().format());
      return exits.success({
        status: true,
        data: { otp },
        message: "OTP sent successfully",
      });
    } catch (e) {
      sails.log.error("error forget pwd", e, "\nTime: ", moment().format());
      return exits.ok({ status: false, data: [], message: e.message });
    }
  },
};
