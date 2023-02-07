const { generateOtp } = require("../../../util");
const moment = require("moment");

module.exports = {
  friendlyName: "contact",

  description: "contact edit.",

  inputs: {
    contact: {
      type: "ref",
      required: true,
      custom: function (value) {
        return (
          _.isObject(value) &&
          !_.isUndefined(value.country_code) &&
          !_.isUndefined(value.number)
        );
      },
    },
    user: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    ok: {
      responseType: "ok",
      description: "Send ok response",
    },
    invalid: {
      responseType: "badRequest",
      description: "Driver not exists",
    },
    serverError: {
      description: "send server error",
      responseType: "serverError",
    },
  },

  fn: async function ({ contact, user }, exits) {
    sails.log.debug("calling user/edit/contact");
    try {
      if (
        user.country_code == contact.country_code &&
        user.contact == contact.number
      ) {
        sails.log.debug("user has entered same contact");
        return exits.success({
          status: false,
          data: [],
          message: "You have entered same phone number.",
        });
      }
      let exists = await User.findOne({
        country_code: contact.country_code,
        contact: contact.number,
        id: { "!=": user.id },
      });
      if (exists) {
        sails.log.debug("user already exists with this contact");
        return exits.success({
          status: false,
          data: [],
          message: "Phone number already taken.",
        });
      }
      let otp = generateOtp();

      await User.update({ id: user.id }).set({
        otp,
        otp_generated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      return exits.success({
        status: true,
        data: { otp },
        message: "OTP sent successfully",
      });
    } catch (e) {
      sails.log.error("error user/edit/contact", e);
      return exits.ok({
        status: false,
        data: [],
        message: "Unable to update phone number.",
      });
    }
  },
};
