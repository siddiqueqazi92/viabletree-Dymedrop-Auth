module.exports = {
  friendlyName: "Personal info",

  description: "Personal info edit.",

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
    username: {
      type: "string",
    },

    password: {
      type: "string",
    },
  },

  exits: {
    invalid: {
      responseType: "badRequest",
      description: "Driver not exists",
    },
    serverError: {
      description: "send server error",
      responseType: "serverError",
    },
    ok: {
      description: "send ok error",
      responseType: "ok",
    },
  },

  fn: async function ({ contact, username, dob, password }, exits) {
    sails.log.debug("calling user/edit/personal-info");
    try {
      let user = await sails.models.userrequest.getByContact(contact);
      //let user = await User.getByContact(contact);
      if (_.isUndefined(user) || (Array.isArray(user) && user.length == 0)) {
        return exits.ok({ status: false, message: "Invalid phone number" });
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
      let obj = {
        username,
        country_code: contact.country_code,
        contact: contact.number,
        // email: "admin@yopmail.com",
        // role: "admin",
      };
      if (password) {
        obj.password = password;
        user.has_password = true;
      }
      user = await sails.models.user.create(obj).fetch();
      //await User.updateOne({ id: user.id }).set(obj);
      user.username = username;
      // user.dob = dob;
      const _user = await sails.helpers.jwt.generateToken.with({ user });
      return exits.success({
        status: true,
        data: _user,
        message: "Personal info updated successfully",
      });
    } catch (e) {
      sails.log.error("error calling user/edit/personal-info", e);
      return exits.serverError({
        status: false,
        data: [],
        message: "Unable to update personal info",
      });
    }
    // All done.
  },
};
