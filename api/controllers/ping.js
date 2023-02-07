module.exports = {
  friendlyName: "Ping",

  description: "Ping something.",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    // sails.log("Action ping started");
    // sails.log("Action ping ended");
    return exits.success();
  },
};
