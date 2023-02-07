const moment = require("moment");

module.exports = {
  friendlyName: "Confirm otp",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
    },
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
    otp: {
      type: "string",
      required: true,
    },
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

  fn: async function ({ user, contact, otp }, exits) {
    sails.log.debug("calling user/edit/contact/confirm-otp", {
      otp,
    });
    try {
      if (!user) {
        throw new Error("Invalid OTP");
      }
      if (user.otp != otp) {
        throw new Error("Invalid OTP");
      }

      var duration = moment.duration(
        moment().diff(moment(user.otp_generated_at))
      );
      var minutes = duration.asMinutes();
      if (minutes >= 5) {
        // throw new Error("Invalid OTP");
        return exits.ok({ status: false, message: "Invalid OTP" });
      }

      await User.updateOne({
        id: user.id,
      }).set({
        otp: "",
        country_code: contact.country_code,
        contact: contact.number,
      });

      // user.forgetPasswordToken = generateRandomString();
      // user.otp = '';

      sails.log.debug("user/edit/contact/confirm-otp");
      return exits.success({
        status: true,
        message: "Phone number changed successfully",
      });
    } catch (e) {
      sails.log.error("error confirm-otp", e);
      return exits.ok({ status: false, data: [], message: e.message });
    }
  },
};
