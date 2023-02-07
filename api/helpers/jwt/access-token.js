const jwt = require('jsonwebtoken');

const jwtToken = {
  access_token: sails.config.JWT.ACCESS_TOKEN,
  refresh_token: sails.config.JWT.REFRESH_TOKEN,
};

// const daysToMin = 365 * 24 * 60 * 60;
// const expireTime = daysToMin+'m';
const expireTime = sails.config.token_expiration

module.exports = {
  friendlyName: 'Access token',

  description: '',

  inputs: {
    payload: {
      type: 'ref',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function ({ payload }, exits) {
    if (payload.role === 'admin') {
      return exits.success(
        jwt.sign(payload, jwtToken.access_token)
      );
    }
    return exits.success(
      jwt.sign(payload, jwtToken.access_token, { expiresIn: expireTime })
    );
  },
};
