const { generateRandomString } = require("../../util");

module.exports = {
  friendlyName: "Create user",

  description: "",

  inputs: {
    name: {
      type: "string",
      required: false,
    },
    username: {
      type: "string",
      required: false,
    },
    email: {
      type: "string",
      required: false,
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
  },

  exits: {
    adminResponse: {
      responseType: "adminResponse",
    },
    invalid: {
      responseType: "badRequest",
      description: "Driver not exists",
    },
    ok: {
      responseType: "ok",
      description: "Ok response",
    },
  },

  fn: async function ({ name, username, contact, email }, exits) {
    sails.log.debug("calling users/create");
    try {
      let user = await sails.models.user.getByContact(contact);

      if (_.isUndefined(user.length)) {
        return exits.ok({
          status: false,
          message: "Phone number already taken",
        });
      }
      if (username) {
        username_exits = await User.count({ username });
        if (username_exits) {
          return exits.ok({
            status: false,
            message: "Username already taken",
          });
        }
      }
      if (email) {
        email_exits = await User.count({ email });
        if (email_exits) {
          return exits.ok({
            status: false,
            message: "Email already taken",
          });
        }
      }
      let obj = {
        username,
        country_code: contact.country_code,
        contact: contact.number,
        email: email,
        // email: "admin@yopmail.com",
        // role: "admin",
      };

      // obj.password = generateRandomString(10);
      obj.password = "123456";
      sails.log({ password: obj.password });

      user = await sails.models.user.create(obj).fetch();

      return exits.success({
        status: true,
        data: user,
        message: "User created successfully",
      });
    } catch (e) {
      sails.log.error("error calling users/create", e);
      return exits.serverError({
        status: false,
        data: [],
        message: "Unable to create user",
      });
    }
    // All done.
  },
};
