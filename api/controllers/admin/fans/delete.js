const {
  generateRandomString,
  generateEncryptedPassword,
} = require("../../../util");
var ejs = require("ejs");
const moment = require("moment");
const path = require("path");

module.exports = {
  friendlyName: "Create Fans",

  description: "Create Fans on Admin Panel.",

  inputs: {
    user: {
      type: "ref",
      required: true,
    },
    id: {
      type: "string",
      required: true,
    },
  },

  exits: {
    badRequest: {
      description: "Bad  Request",
      responseType: "badRequest",
    },
  },

  fn: async function ( inputs, exits) {
    try {
      sails.log(`Calling Admin/Fans/Delete 
                  Time: ${moment().format()}`);
      const deletedAt = moment().format("YYYY-MM-DD HH:mm:ss");
      const getuser = await sails.models.user.find({
        id: inputs.id,
        deletedAt: null,
      });
      console.log({getuser});

     
      if (getuser.length < 1) {
        return exits.success({
          status: false,
          message: "User not found",
          data: {},
        });
      }

      const userDelete = await sails.models.user
        .updateOne({
          id: inputs.id,
        })
        .set({ deletedAt: deletedAt })
      return exits.success({
        status: true,
        message: "user deleted successfully",
      });
    } catch (error) {

        console.log(error.message);
      return exits.badRequest({
        status: false,
        data: [],
        message: "unknown server error",
      });
    }
  },
};
