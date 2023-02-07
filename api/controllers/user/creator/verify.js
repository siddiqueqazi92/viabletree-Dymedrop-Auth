module.exports = {
  friendlyName: "GET Verified User",

  description: "GET Verified User",

  inputs: {
    user: {
      type: "ref",
    },
    email: {
      type: "string",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      sails.log("call user/creator/verify ");
      const id = inputs.user.id;
      const getVerified = await sails.models.user.find({
        email: inputs.email,
        currentUser: "creator",
      });
      let response = {};
      if (getVerified.length > 0) {
        if (getVerified[0].status === global.STATUS[2]) {
          response = {
            status: true,
            message: "Creator exist with this email.",
            data: getVerified[0],
            fan: false,
            user: "creator",
          };
        } else {
          response = {
            status: true,
            message: "Creator does not exist with this email.",
            data: {},
            fan: true,
            user: "creator",
          };
        }
      } else {
        const getFan = await sails.models.user.find({
          email: inputs.email,
          currentUser: "fan",
        });
        if (getFan.length > 0) {
          response = {
            status: true,
            message: "Fan can not be invited.",
            data: getFan[0],
            fan: true,
            user: "fan",
          };
        } else {
          response = {
            status: false,
            message: "Creator does not exist with this email.",
            data: {},
            fan: false,
            user: "invitee",
          };
        }
      }
      sails.log(
        `Action user/creator/verify ended with Response: ${JSON.stringify(
          response
        )}`
      );
      return exits.success(response);
    } catch (err) {
      sails.log.debug(err);
      return exits.success({
        status: false,
        message: err.message,
        data: {},
      });
    }
  },
};
