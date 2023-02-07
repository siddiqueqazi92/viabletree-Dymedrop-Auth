const {
  generateRandomString,
  generateEncryptedPassword,
} = require("../../../util");
var ejs = require("ejs");
const moment = require("moment");
const path = require("path");
const axios = require("axios")

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
    },
  },

  exits: {
    badRequest: {
      description: "Bad  Request",
      responseType: "badRequest",
    },
  },

  fn: async function (inputs, exits) {
    try {
      sails.log(`Calling Admin/Fans/List 
                  Time: ${moment().format()}`);

      const users = await User.find({
        where: {
          currentUser: "fan",
          id: inputs.id,
          deletedAt: null,
        },
      });
      
      

      if (users.length < 1) {
        return exits.success({
          status: false,
          message: "No user found",
        });
      }

      console.log(sails.config.GATEWAY_SERVER +`fans/activations/${inputs.id}`, "GATEWAY");
      const getUserActivations = await axios.get(sails.config.GATEWAY_SERVER+`fans/activations/${inputs.id}`);
      console.log(getUserActivations.data);
      users[0].purchasedActivations = getUserActivations.data.data



      return exits.success({
        status: true,
        data: users[0],
        message: "user listed successfully",
      });
    } catch (error) {
      return exits.badRequest({
        status: false,
        data: [],
        message: error.message,
      });
    }
  },
};
