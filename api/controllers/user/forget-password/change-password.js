const {
  generateEncryptedPassword,
  comparePrevPassword,
} = require("../../../util");
const bcrypt = require("bcrypt-nodejs");
const moment = require("moment");
module.exports = {
  friendlyName: "Change password",

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
      type: "string",
      required: false,
      isEmail: true,
    },
    password: {
      type: "string",
      required: true,
      custom: function (value) {
        return (value.replace(/\s/g, "").length > 0 && value.length > 5)
      },
    },
    token: {
      type: "string",
      required: true,
    },
  },

  exits: {
    invalid: {
      responseType: "badRequest",
    },
    ok: {
      description: "send ok error",
      responseType: "ok",
    },
  },

  fn: async function ({ contact, email, token, password }, exits) {
    sails.log.debug("calling user/forget-password/change-password. Inputs: contact: ", contact, "email: ", email, "token: ", token, "password: ", password, "\nTime: ", moment().format());
    if (!email && !contact) {
      sails.log.debug(
        "Error at user/forget-password/change-password. REASON: Email/Contact required\nTime: ",
        moment().format()
      );
      return exits.success({
        status: false,
        data: [],
        message: "Email/Contact required.",
      });
    }
    let where = {
      forget_password_token: token,
    };
    if (email) {
      where.email = email;
    }
    if (contact) {
      where.country_code = contact.country_code;
      where.contact = contact.number;
    }
    try {
      const user = await User.findOne(where);
      if (!user) {
        throw new Error("Invalid Token");
      }

      if (user.password) {
        const samePassword = await comparePrevPassword(password, user.password);
        if (samePassword) {
          sails.log.debug(
            "Error at user/forget-password/change-password REASON: Password same as old one.\nTime: ",
            moment().format()
          );
          return exits.success({
            status: false,
            data: [],
            message: "New password is same as old password.",
          });
        }
      }

      //   const hashedPassword = await generateEncryptedPassword(password);
      await User.updateOne({ id: user.id }).set({
        forget_password_token: "",
        password: password,
      });

      sails.log.debug(
        "user/forget-password/change-password executed successfully. RESULT: Password changed.\nTime: ",
        moment().format()
      );
      return exits.success({
        status: true,
        data: [],
        message: "Password saved.",
      });
    } catch (e) {
      sails.log.error(
        "error user/forget-password/change-password",
        e,
        "\nTime: ",
        moment().format()
      );
      return exits.ok({
        status: false,
        data: [],
        message: e.message || "server error",
      });
    }
  },
};
