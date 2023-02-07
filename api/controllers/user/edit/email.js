const { use } = require("passport");

module.exports = {
  friendlyName: "email",

  description: "email edit.",

  inputs: {
    email: {
      type: "string",
      required: true,
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

  fn: async function ({ email, user }, exits) {
    sails.log.debug("calling user/edit/email");
    try {
      if (user.email == email) {
        sails.log.debug("user has entered same email");
        return exits.success({
          status: false,
          data: [],
          message: "You have entered same email.",
        });
      }
      let exists = await User.findOne({ email, id: { "!=": user.id } });
      if (exists) {
        sails.log.debug("user already exists with this email");
        return exits.success({
          status: false,
          data: [],
          message: "Email already taken.",
        });
      }
      await User.update({ id: user.id }).set({ email: email });
      return exits.success({
        status: true,
        data: [],
        message: "Email updated successfully",
      });
    } catch (e) {
      sails.log.error("error user/edit/email", e);
      return exits.ok({
        status: false,
        data: [],
        message: "Unable to update email.",
      });
    }
  },
};
