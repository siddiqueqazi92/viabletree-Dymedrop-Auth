const {
  comparePrevPassword,
  generateEncryptedPassword,
} = require("../../../util");

const moment = require('moment')

module.exports = {
  friendlyName: "Password",

  description: "Password edit.",

  inputs: {
    current_password: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
      custom: function (value) {
        return (value.replace(/\s/g, "").length > 0 && value.length > 5)
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

  fn: async function ({ password, current_password, user }, exits) {
    sails.log.debug("calling user/edit/password\nTime: ", moment().format());
    try {
      const verifyPassword = await comparePrevPassword(
        current_password,
        user.password
      );
      if (!verifyPassword) {
        sails.log.debug("user has entered wrong password\nTime: ", moment().format());
        return exits.success({
          status: false,
          data: [],
          message: "Old password is incorrect.",
        });
      }
      const isSame = await comparePrevPassword(password, user.password);
      if (isSame) {
        sails.log.debug("user has entered same old password\nTime: ", moment().format());
        return exits.success({
          status: false,
          data: [],
          message: "New password is same as old password.",
        });
      }

      sails.log.error("user/edit/password executed successfully\nTime: ", moment().format());
      await User.update({ id: user.id }).set({ password: password });
      return exits.success({
        status: true,
        data: [],
        message: "Password saved",
      });
    } catch (e) {
      sails.log.error("error user/edit/password", e, "\nTime: ", moment().format());
      return exits.ok({
        status: false,
        data: [],
        message: "Unable to update password.",
      });
    }
  },
};
