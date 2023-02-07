const { generateRandomString } = require("../../../util");
const moment = require("moment");

module.exports = {
  friendlyName: "Confirm otp",

  description: "",

  inputs: {
    otp: {
      type: "string",
      required: true,
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
    email: {
      type: 'string',
      required: false,
      isEmail: true
    }
  },

  exits: {
    invalid: {
      responseType: "badRequest",
      description: "Driver not exists",
    },
    ok: {
      description: "send ok error",
      responseType: "ok",
    },
  },

  fn: async function ({ contact, email, otp }, exits) {
    sails.log.debug("calling user/forget-password/confirm-otp", { otp, contact, email }, "\nTime: ", moment().format());
    if (!email && !contact) {
      sails.log.error("Error at user/forget-password/confirm-otp.js with reason: '!inputs.email && !inputs.contact'\nTime: ", moment().format());
      return exits.notFound({ status: false, data: [], message: "Email/contact is required" });
    }
    let where = {};
    if (contact) {
      where.country_code = contact.country_code;
      where.number = contact.number
    }
    if (email) {
      where.email = email
    }
    try {
      const user = await User.findOne({ ...where, otp });

      if (!user) {
        throw new Error("Invalid OTP");
      }

      var duration = moment.duration(
        moment.utc().diff(moment.utc(user.otp_generated_at))
      );
      var minutes = duration.asMinutes();
      if (minutes >= 5) {
        // throw new Error("Invalid OTP");
        sails.log.error("Error at user/forget-password/confirm-otp.js with reason: 'OTP Expired (issued more than 5 mins ago)'\nTime: ", moment().format());
        return exits.ok({ status: false, message: "Invalid OTP" });
      }
      const forget_password_token = generateRandomString();
      await User.updateOne(where).set({
        otp: "",
        forget_password_token,
      });

      // user.forgetPasswordToken = generateRandomString();
      // user.otp = '';

      sails.log.debug("user/forget-password/confirm-otp");
      return exits.success({
        status: true,
        data: { forget_password_token },
        message: "Success",
      });
    } catch (e) {
      sails.log.error("error confirm-otp", e);
      return exits.ok({ status: false, data: [], message: e.message });
    }
  },
};
