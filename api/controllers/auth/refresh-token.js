const moment = require('moment')

module.exports = {


  friendlyName: 'Refresh token',


  description: '',


  inputs: {
    token: {
      type: 'string',
      required: true,
      description: 'Refresh token required to generate new access_token'
    }
  },


  exits: {
    invalid: {
      responseType: 'badRequest',
      description: '',
    },
  },


  fn: async function ({ token }, exits) {
    sails.log.debug('calling auth/refresh-token', token, "\nTime: ", moment().format());
    try {
      const tokens = await sails.helpers.jwt.refreshToken.with({ token });
      sails.log.debug('executed auth/refresh-token with new tokens: ', JSON.stringify(tokens), "\nTime: ", moment().format());
      return exits.success({
        status: true,
        data: {
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken
        },
        message: 'Token generated successfully'
      });
    } catch (e) {
      sails.log.error('Error at auth/Refresh Token ', e, "\nTime: ", moment().format());
      return exits.invalid({ status: false, data: [], message: e.message });
    }

  }


};
