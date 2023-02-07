/**
 * UserRequest.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const { generateEncryptedPassword } = require("../util");
module.exports = {
  tableName: "user_requests",
  attributes: {
    createdAt: false,
    updatedAt: false,
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
    },
    password: {
      type: "string",
      required: false,
      allowNull: true,
    },
    country_code: {
      type: "string",
      required: false,
      allowNull: true,
    },
    contact: {
      type: "string",
      required: false,
      allowNull: true,
    },
    otp: {
      type: "string",
      required: true,
    },
    otp_generated_at: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
    currentUser: {
      type: "string",
      required: false,
     // allowNull: true,
    },
    is_invited :{
      type :"boolean",
      required:false
    }
  },
  customToJSON: function () {
    return _.omit(this, ["id", "email", "password"]);
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
    if (user.password) {
      try {
        user.password = await generateEncryptedPassword(user.password);
        return cb();
      } catch (e) {
        sails.log.error("error hashing password", e);
        throw new Error("Error: Cannot hash password.");
      }
    } else {
      return cb();
    }
  },
  getByContact: async function (contact) {
    //sails.log.debug("opt", opt);
    const _user = await UserRequest.findOne({
      country_code: contact.country_code,
      contact: contact.number,
    });
    if (_user) {
      _user.hasPassword = false;
      if (_user.password) {
        _user.hasPassword = true;
      }
    }
    return _user;
  },
};
