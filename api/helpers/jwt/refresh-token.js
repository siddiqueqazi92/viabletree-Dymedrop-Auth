const jwt = require('jsonwebtoken');

const jwtToken = {
  access_token: sails.config.JWT.ACCESS_TOKEN,
  refresh_token: sails.config.JWT.REFRESH_TOKEN
};

module.exports = {

  friendlyName: 'Refresh token',

  description: 'To refresh token when expired. provided by refresh token by client',

  inputs: {
    token: {
      type: 'string',
      required: true
    }

  },

  exits: {

    success: {
      description: 'All done.',
    },
    invalid: {
      description: 'invalid token given'
    },
    invalidUser: {
      description: 'invalid user'

    }
  },

  fn: async function (inputs, exits) {
    sails.log.debug('calling helpers/jwt/refresh-token');
    try {
      const token = await Token.find({ token: inputs.token }).limit(1);
      if (token.length < 1) { return exits.invalid(); }
      jwt.verify(inputs.token, jwtToken.refresh_token, async (err, user) => {
        if (err) {
          sails.log.error('Error verify refresh token ', err);
          return exits.invalid();
        }
        let dbuser = await User.find({ id: user.id }).limit(1);
        if (dbuser.length < 1) { exits.invalidUser(); }


          dbuser = await sails.helpers.jwt.generateToken.with({ user: { ...dbuser[0] } })
          await Token.destroy({ token: inputs.token })

        return exits.success({ accessToken: dbuser.access_token, refreshToken: dbuser.refresh_token });
      });
    } catch (e) {
      sails.log.error('Error creating token', e);
      return exits.invalid();
    }
  }

};

