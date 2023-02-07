const { generateEncryptedPassword } = require("../../util");

module.exports = {
  friendlyName: "Update user",

  description: "",

  inputs: {
    id: {
      type: "string",
      required: true,
    },
    first_name: {
      type: "string",
      required: false,
      allowNull: true,
    },
    last_name: {
      type: "string",
      required: false,
      allowNull: true,
    },
    email: {
      type: "string",
      required: false,
      isEmail: true,
    },
    password: {
      type: "string",
      required: false,
      allowNull:true
      // custom: function (value) {
      //   return (value.replace(/\s/g, "").length > 0 && value.length > 5)
      // },
    },
    confirm_password: {
      type: "string",
      required: false,
      allowNull:true
    },
    is_blocked: {
      type: "boolean",
      required: false,
    },
    is_active: {
      type: 'boolean'
    },
    status: {
      type: 'string',
      required: false
    }
    // avatar: {
    //   type: "string",
    //   required: false,
    //   isEmail: true,
    // }
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
    serverError: {
      responseType: "serverError",
      description: "Server Error",
    },
  },

  fn: async function ({ id, first_name, last_name, email, is_blocked, is_active, password, confirm_password, status }, exits) {
    sails.log.debug("calling users/update");
    try {
      let user = await User.findOne({ id });
      if (!user) {
        return exits.ok({
          status: false,
          message: "Invalid ID",
          data: { id: null },
        });
      }

      const obj = { id, email, is_blocked, is_active,is_form_submitted: true, }

      if (first_name) {
        obj.first_name = first_name
      }

      if (last_name) {
        obj.last_name = last_name
      }

      if (status) {
        obj.status = status
      }

      if (password && confirm_password) {
        if (password !== confirm_password) {
          return exits.ok({
            status: false,
            message: "Password and confirm password doesn't match",
            data: {},
          });
        }
        // const hashPassword = await generateEncryptedPassword(password)
        obj.password = password
      }
      // password
      if (!_.isEmpty(obj)) {
        user = await sails.models.user.updateOne({ id }).set({ ...obj });
      }

      const _user = await sails.helpers.jwt.generateToken.with({ user });
      await Token.destroy({ user_id: id })


      delete _user.createdAt
      delete _user.deletedAt
      delete _user.forget_password_token
      delete _user.otp
      delete _user.otp_generated_at
      delete _user.password
      delete _user.role

      return exits.success({
        status: true,
        data: _user,
        message: "User updated successfully",
      });
    } catch (e) {
      sails.log.error("error calling users/update", e);
      return exits.serverError({
        status: false,
        data: [],
        message: "Unable to update user",
      });
    }
    // All done.
  },
};
