const Validator = require("validatorjs");

module.exports = {
  friendlyName: "Validate",

  description: "Validate user.",

  inputs: {
    image: {
      type: "string",
      required: false,
    },
    email: {
      type: "string",
      required: true,
      isEmail: true,
    },
    name: {
      type: "string",
      required: false,
    },
    password: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs) {
    sails.log.debug("calling user/validate");

    const rules = {
      // name: 'required',
      //  image: 'required',
      email: "required|email",
      //  password: 'required'
    };

    const validation = new Validator(inputs, rules);

    return validation.passes();
  },
};
