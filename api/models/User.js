/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const { generateEncryptedPassword } = require("../util");

module.exports = {
  tableName: "users",
  attributes: {
    id: {
      type: "string",
      columnName: "_id",
      autoIncrement: true,
    },
    email: {
      type: "string",
      required: false,
      isEmail: true,
      allowNull: true,
      unique: true,
    },
    password: {
      type: "string",
    },

    otp: {
      type: "string",
    },
    otp_generated_at: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
    // device_token: {
    //   type: "string",
    //   required: false,
    //   allowNull: true,
    // },
    forget_password_token: {
      type: "string",
      required: false,
      allowNull: true,
    },
    first_name: {
      type: "string",
      required: false,
      defaultsTo: "",
    },
    last_name: {
      type: "string",
      required: false,
      defaultsTo: "",
    },

    full_name: {
      type: "string",
      required: false,
      defaultsTo: "",
    },

    deletedAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
    avatar: {
      type: "string",
      required: false,
      defaultsTo:
        "https://ahauserposts.s3.amazonaws.com/image_2021_11_25T18_57_06_110Z.png",
    },
    is_active: {
      type: "boolean",
      defaultsTo: true,
    },
    is_blocked: {
      type: "boolean",
      defaultsTo: false,
    },
    is_form_submitted: {
      type: "boolean",
      required: false,
      defaultsTo: false,
    },
    status: {
      type: "string",
      isIn: global.STATUS,
      required: false,
      // defaultsTo: global.STATUS[0]
    },
    role: {
      type: "string",
      defaultsTo: "user",
    },
    updatedAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
    createdAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
    currentUser: {
      type: "string",
      required: false,
    },
    is_invited: {
      type: "boolean",
      required: false,
    },
    image_url: {
      type: "string",
    },
  },

  customToJSON: function () {
    return _.omit(this, [
      "password",
      "otp",
      "deletedAt",
      "createdAt",
      "updatedAt",
      "forget_password_token",
      "country_code",
      "contact",
      "otp_generated_at",
      "name",
      "username",
      "dob",
      "profile_image",
    ]);
  },

  beforeCreate: async function (user, cb) {
    sails.log.debug("calling beforeCreate user");

    let where = {};
    let message = null;
    if (user.country_code && user.contact) {
      where.country_code = user.country_code;
      where.contact = user.contact;
      message = "Phone number already registered";
    }
    if (user.email) {
      where.email = user.email;
      message = "Email already registered";
    }
    let userData = await User.find(where);
    if (userData.length > 0) {
      sails.log.error("error user already exists");
      return cb(message);
    }
    await UserRequest.destroy(where);
    // if (user.password) {
    //   try {
    //     user.password = await generateEncryptedPassword(user.password);
    //     return cb();
    //   } catch (e) {
    //     sails.log.error("error hashing password", e);
    //     throw new Error("Error: Cannot hash password.");
    //   }
    // }
    return cb();
  },
  beforeUpdate: async function (user, cb) {
    sails.log.debug("calling beforeUpdate user");
    if (user.password) {
      try {
        user.password = await generateEncryptedPassword(user.password);
        return cb();
      } catch (e) {
        sails.log.error("error hashing password", e);
        throw new Error("Error: Cannot hash password.");
      }
    }
    return cb();
  },
  getOne: async function (opt) {
    //sails.log.debug("opt", opt);
    const _user = await User.findOne({ ...opt });
    if (_user) {
      _user.has_password = false;
      if (_user.password) {
        delete _user.password;
        _user.has_password = true;
      }
    }
    return _user;
  },
  getByContact: async function (contact) {
    //sails.log.debug("opt", opt);
    let _user = await User.find({
      country_code: contact.country_code,
      contact: contact.number,
    });
    if (_user.length) {
      _user = _user[0];
      _user.has_password = false;
      if (_user.password) {
        _user.has_password = true;
      }
    }
    return _user;
  },
};
